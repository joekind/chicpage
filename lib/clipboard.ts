/**
 * Clipboard helpers with focus recovery + execCommand fallback.
 * Chrome throws "Document is not focused" when write() runs after
 * async work or when the window lost focus.
 *
 * Prefer calling write() in the same user-gesture turn with Promise
 * ClipboardItem values so async HTML prep (e.g. asset inlining) can finish
 * without losing clipboard permission.
 */

function ensureWindowFocus() {
  try {
    window.focus();
  } catch {
    // ignore
  }
}

function copyTextViaExecCommand(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;margin:0;opacity:0.01;border:none;outline:none;";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, ta.value.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } finally {
    document.body.removeChild(ta);
  }
  return ok;
}

function copyHtmlViaExecCommand(html: string, plain: string): boolean {
  ensureWindowFocus();

  const div = document.createElement("div");
  div.contentEditable = "true";
  div.innerHTML = html;
  // Avoid opacity:0 — some browsers refuse to copy from fully invisible nodes
  div.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;margin:0;opacity:0.01;overflow:hidden;border:none;outline:none;z-index:-1;";
  document.body.appendChild(div);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(div);
  selection?.removeAllRanges();
  selection?.addRange(range);
  div.focus();

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } finally {
    selection?.removeAllRanges();
    document.body.removeChild(div);
  }

  if (ok) return true;
  return copyTextViaExecCommand(plain);
}

export async function copyTextToClipboard(text: string): Promise<void> {
  ensureWindowFocus();
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // fall through
  }
  if (!copyTextViaExecCommand(text)) {
    throw new Error("复制文本失败");
  }
}

export async function copyHtmlToClipboard(
  html: string | Promise<string>,
  plain: string | Promise<string>,
): Promise<void> {
  ensureWindowFocus();

  const htmlBlob = Promise.resolve(html).then(
    (value) => new Blob([value], { type: "text/html" }),
  );
  const plainBlob = Promise.resolve(plain).then(
    (value) => new Blob([value], { type: "text/plain" }),
  );

  // Pass Promises into ClipboardItem so write() can be invoked in the
  // user-gesture turn while HTML is still being prepared asynchronously.
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": plainBlob,
      }),
    ]);
    return;
  } catch {
    // fall through — unsupported Promise values, focus loss, etc.
  }

  const htmlStr = await Promise.resolve(html);
  const plainStr = await Promise.resolve(plain);
  ensureWindowFocus();

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([htmlStr], { type: "text/html" }),
        "text/plain": new Blob([plainStr], { type: "text/plain" }),
      }),
    ]);
    return;
  } catch {
    // fall through
  }

  if (!copyHtmlViaExecCommand(htmlStr, plainStr)) {
    throw new Error("复制 HTML 失败");
  }
}

'use client';

import { useCallback, useMemo, useState } from 'react';
import { Edit3, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { InsertLinkDialog } from '@/components/workspace/dialogs/insert-link-dialog';
import { useMobileWorkspaceController } from '@/hooks/use-mobile-workspace-controller';
import { getReadInfo } from '@/lib/content';
import { cn } from '@/lib/utils';
import type { MobilePanel } from '@/types/mobile';

import { MobileEditorPane } from './mobile-editor-pane';
import { MobileExportPreview } from './mobile-export-preview';
import { MobilePreviewPane } from './mobile-preview-pane';
import { MobileTopBar } from './mobile-top-bar';

const panelSwitchButtonClassName =
  'fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-4 z-50 h-11 rounded-full border-border bg-background px-4 font-bold text-foreground shadow-2xl shadow-foreground/15 ring-1 ring-border/70 backdrop-blur-xl transition-all duration-200 hover:bg-muted';

export function MobileWorkspace() {
  const workspace = useMobileWorkspaceController();
  const [panel, setPanel] = useState<MobilePanel>('edit');

  const { state, refs, actions } = workspace;
  const hasActiveTextSelection = panel === 'edit' && state.selection && !state.selection.empty;
  const nextPanel: MobilePanel = panel === 'edit' ? 'preview' : 'edit';
  const nextPanelLabel = panel === 'edit' ? '预览' : '编辑';
  const previewReadInfo = useMemo(() => getReadInfo(state.markdown), [state.markdown]);
  const handleImportMarkdown = useCallback(() => {
    const input = document.getElementById('mobile-md-import-input') as HTMLInputElement | null;
    input?.click();
  }, []);

  return (
    <div className='flex h-svh w-full max-w-full flex-col overflow-hidden bg-background tracking-normal text-foreground selection:bg-primary/15'>
      <MobileTopBar
        panel={panel}
        styleTheme={state.styleTheme}
        wechatTheme={state.wechatTheme}
        posterTheme={state.posterTheme}
        posterFont={state.posterFont}
        showWordCount={state.showWordCount}
        copyStatus={state.copyStatus}
        exportStatus={state.exportStatus}
        isExportingPoster={state.isExportingPoster}
        exportProgress={state.exportProgress}
        onCopy={actions.handleCopy}
        onStyleThemeChange={actions.setStyleTheme}
        onWechatThemeChange={actions.setWechatTheme}
        onPosterThemeChange={actions.setPosterTheme}
        onPosterFontChange={actions.setPosterFont}
        onShowWordCountChange={actions.setShowWordCount}
        onExportHtml={actions.handleExportHtml}
        onExportMarkdown={actions.handleExportMarkdown}
        onOpenPosterExportPreview={actions.handleOpenPosterExportPreview}
      />

      <main className='relative min-h-0 flex-1 overflow-hidden'>
        <section
          className={cn(
            panel === 'edit'
              ? 'absolute inset-0 opacity-100'
              : 'pointer-events-none invisible absolute inset-0 opacity-0',
          )}
          aria-hidden={panel !== 'edit'}
        >
          <MobileEditorPane
            isActive={panel === 'edit'}
            markdown={state.markdown}
            editorRef={refs.editorRef}
            selection={state.selection}
            isUploading={state.isUploading}
            uploadNotice={state.uploadNotice}
            onChange={actions.setMarkdown}
            onPaste={actions.handlePaste}
            onFileUpload={actions.handleFileUpload}
            onImageFile={actions.handleImageFile}
            onSelectionChange={actions.handleSelectionChange}
            onPushHistory={actions.pushHistory}
            onHeading={actions.handleHeading}
            onBold={actions.handleBold}
            onQuote={actions.handleQuote}
            onSeparator={actions.handleSeparator}
            onInsertPageBreak={actions.handleInsertPageBreak}
            onInsertTable={actions.handleInsertTable}
            onInsertAtLineStart={actions.handleInsertAtLineStart}
            onInsertText={actions.handleInsertText}
            onWrapText={actions.handleWrapText}
            onInsertImage={actions.handleInsertImage}
            onImportMarkdown={handleImportMarkdown}
            onInsertLink={actions.handleOpenInsertLink}
            onClearFormatting={actions.handleClearFormatting}
            onUndo={actions.handleUndo}
            onRedo={actions.handleRedo}
            canUndo={state.canUndo}
            canRedo={state.canRedo}
          />
        </section>

        {panel === 'preview' ? (
          <section className='absolute inset-0 opacity-100'>
            <MobilePreviewPane
              html={state.html}
              styleTheme={state.styleTheme}
              imgRadius={state.imgRadius}
              activeTheme={state.activeTheme}
              activeThemeCss={state.activeTheme.css}
              activePosterTheme={state.activePosterTheme}
              posterFont={state.posterFont}
              posterRatio={state.posterRatio}
              posterShowHeader={state.posterShowHeader}
              posterShowFooter={state.posterShowFooter}
              posterLayout={state.posterLayout}
              wordCount={previewReadInfo.wordCount}
              readTime={previewReadInfo.readTime}
              previewRef={refs.previewRef}
              posterSlideRef={refs.posterSlideRef}
              onPosterRatioChange={actions.setPosterRatio}
              onImageWidthChange={actions.handleImageWidthChange}
            />
          </section>
        ) : null}
      </main>

      <Button
        type='button'
        variant='outline'
        title={nextPanelLabel}
        aria-label={nextPanelLabel}
        onClick={() => setPanel(nextPanel)}
        className={cn(
          panelSwitchButtonClassName,
          hasActiveTextSelection && 'pointer-events-none translate-y-2 opacity-0',
        )}
      >
        {panel === 'edit' ? <Eye data-icon='inline-start' /> : <Edit3 data-icon='inline-start' />}
        {nextPanelLabel}
      </Button>

      <MobileExportPreview
        containerRef={refs.exportPreviewRef}
        isOpen={state.showExportPreview}
        onClose={() => actions.setShowExportPreview(false)}
        onConfirm={actions.handleConfirmPosterExport}
        slides={state.previewSlides}
        theme={state.activePosterTheme}
        themeCSS={state.posterThemeCSS}
        layout={state.posterLayout}
        isSubmitting={state.isExportingPoster}
        exportProgress={state.exportProgress}
      />

      <InsertLinkDialog
        isOpen={state.isLinkDialogOpen}
        url={state.linkUrl}
        text={state.linkText}
        onUrlChange={actions.setLinkUrl}
        onTextChange={actions.setLinkText}
        onClose={actions.handleCloseInsertLink}
        onConfirm={actions.handleConfirmInsertLink}
      />
    </div>
  );
}

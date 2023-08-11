import {
  ConfigComponent,
  isComponentConfig,
  isContentPieceFull,
  isContentPieceLocal,
  isContentPieceRemote,
  isDocument,
  isRawContent,
  isRawContentFull,
  isRawContentLocal,
  isRawContentRemote,
  PreviewMetadata,
} from "@easyblocks/core";

function getContentSummaryLabel(cmsContent: unknown) {
  if (!cmsContent) {
    return "Empty";
  }

  if (typeof cmsContent !== "object") {
    throw new Error("Invalid content");
  }

  if (!isDocument(cmsContent)) {
    if (isRawContent(cmsContent)) {
      if (cmsContent.preview) {
        return getSummaryLabelFromPreviewData(cmsContent.preview);
      }
    }

    // If content is remote, we don't have access to its config outside of editor.
    // It also means that content was saved before introducing preview data.
    // After first save in editor, content will be saved in new format with preview.
    if (isRawContentRemote(cmsContent) || isContentPieceRemote(cmsContent)) {
      return;
    }

    return getSummaryLabelFromContent(cmsContent);
  }

  if (!cmsContent.preview) {
    return;
  }

  return getSummaryLabelFromPreviewData(cmsContent.preview);
}

export { getContentSummaryLabel };

function getSummaryLabelFromPreviewData(preview: PreviewMetadata) {
  if (preview.mode === "grid") {
    return getGridModeSummaryLabel(
      (preview as Extract<PreviewMetadata, { mode: "grid" }>).extraCardsCount
    );
  }

  return getContentModeSummaryLabel(
    (preview as Exclude<PreviewMetadata, { mode: "grid" }>).sectionsCount
  );
}

function getSummaryLabelFromContent(content: object) {
  let config: ConfigComponent | undefined;

  // In any other case, we can access preview directly from config in content as a fallback.
  if (isRawContentLocal(content) || isRawContentFull(content)) {
    config = content.content;
  } else if (isContentPieceLocal(content) || isContentPieceFull(content)) {
    config = content.config;
  } else if (isComponentConfig(content)) {
    config = content;
  } else {
    throw new Error("Invalid content");
  }

  if (config._template === "$RootGrid") {
    const numberOfCards = config.data[0].Component[0].Cards.filter(
      (x: any) => x._template !== "$Placeholder"
    ).length;

    return getGridModeSummaryLabel(numberOfCards);
  } else {
    return getContentModeSummaryLabel((config.data || []).length);
  }
}

function getContentModeSummaryLabel(sectionsCount: number) {
  return `${sectionsCount} section${sectionsCount === 1 ? "" : "s"} picked`;
}

function getGridModeSummaryLabel(extraCardsCount: number) {
  return `Collection grid, number of extra cards: ${extraCardsCount}`;
}

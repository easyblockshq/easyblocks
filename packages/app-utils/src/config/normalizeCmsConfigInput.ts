import {
  ConfigComponent,
  ContentPiece,
  LocalisedConfigs,
  LocalisedContentPiece,
  LocalisedRawContent,
  RawContent,
  RawContentFull,
  RawContentLocal,
} from "@easyblocks/core";
import { entries } from "@easyblocks/utils";
import {
  isContentPiece,
  isContentPieceFull,
  isContentPieceLocal,
  isRawContent,
} from "../types";
import { isComponentConfig } from "./isComponentConfig";
import { isLocalisedContentPiece } from "./isLocalisedContentPiece";
import { isLocalizedComponentConfig } from "./isLocalizedComponentConfig";

function normalizeNonDocumentCmsInput(
  cmsConfig: LocalisedConfigs | LocalisedContentPiece | LocalisedRawContent
): LocalisedRawContent {
  if (
    isLocalizedComponentConfig(cmsConfig) ||
    isLocalisedContentPiece(cmsConfig)
  ) {
    const rawContent: LocalisedRawContent = Object.fromEntries(
      entries(cmsConfig).map(([locale, config]) => {
        return [locale, convertInputConfigIntoRawContent(config)];
      })
    );

    return rawContent;
  }

  return cmsConfig;
}

function convertInputConfigIntoRawContent(
  config: ConfigComponent | ContentPiece | RawContent
): RawContent {
  if (isContentPiece(config)) {
    if (isContentPieceFull(config)) {
      const rawContentFull: RawContentFull = {
        id: config.id,
        hash: config.hash,
        content: config.config,
      };

      return rawContentFull;
    }

    if (isContentPieceLocal(config)) {
      const rawContentLocal: RawContentLocal = {
        content: config.config,
      };

      return rawContentLocal;
    }

    return config;
  }

  if (isComponentConfig(config)) {
    return {
      content: config,
    };
  }

  // At this point it's clear that we've received raw content, but overlapping with content piece makes TS stupid
  if (!isRawContent(config)) {
    throw new Error("Unreachable");
  }

  return config;
}

export { normalizeNonDocumentCmsInput, convertInputConfigIntoRawContent };

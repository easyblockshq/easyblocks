import {
  LocalisedConfigs,
  LocalisedContentPiece,
  LocalisedRawContent,
} from "@easyblocks/core";
import { isContentPiece } from "../types/ContentPiece";

export function isLocalisedContentPiece(
  value:
    | LocalisedConfigs
    | LocalisedContentPiece
    | LocalisedRawContent
    | undefined
): value is LocalisedContentPiece {
  if (value === undefined) {
    return false;
  }

  if (Object.values(value).length === 0) {
    return false;
  }

  return Object.values(value).every(isContentPiece);
}

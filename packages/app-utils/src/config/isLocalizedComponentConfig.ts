import {
  LocalisedConfigs,
  LocalisedContentPiece,
  LocalisedRawContent,
} from "@easyblocks/core";
import { isComponentConfig } from "./isComponentConfig";

export function isLocalizedComponentConfig(
  value:
    | LocalisedConfigs
    | LocalisedContentPiece
    | LocalisedRawContent
    | undefined
): value is LocalisedConfigs {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value !== "object") {
    return false;
  }

  if (Object.values(value).length === 0) {
    return false;
  }

  return Object.values(value).every(isComponentConfig);
}

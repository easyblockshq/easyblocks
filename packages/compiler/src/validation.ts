import { isComponentConfig } from "@easyblocks/app-utils";
import {
  ContentPiece,
  RawContent,
  ComponentConfig,
  isContentPiece,
  isRawContent,
  isDocument,
  Document,
} from "@easyblocks/core";

function validate(input: unknown):
  | {
      isValid: true;
      input:
        | Document
        | ContentPiece
        | RawContent
        | ComponentConfig
        | null
        | undefined;
    }
  | { isValid: false } {
  const isValid =
    input === null ||
    input === undefined ||
    isDocument(input) ||
    isLegacyInput(input);

  if (!isValid) {
    return {
      isValid: false,
    };
  }

  return {
    isValid: true,
    input: input as
      | Document
      | ContentPiece
      | RawContent
      | ComponentConfig
      | null
      | undefined,
  };
}

export { validate };

function isLegacyInput(
  input: unknown
): input is ContentPiece | RawContent | ComponentConfig {
  return (
    isComponentConfig(input) || isContentPiece(input) || isRawContent(input)
  );
}

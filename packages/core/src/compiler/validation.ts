import { isComponentConfig, isDocument } from "../checkers";
import { NoCodeComponentEntry, Document } from "../types";

function validate(input: unknown):
  | {
      isValid: true;
      input: Document | NoCodeComponentEntry | null | undefined;
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
    input: input as Document | NoCodeComponentEntry | null | undefined,
  };
}

export { validate };

export function isLegacyInput(input: unknown): input is NoCodeComponentEntry {
  return isComponentConfig(input);
}

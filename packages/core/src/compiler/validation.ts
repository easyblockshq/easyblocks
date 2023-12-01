import { isComponentConfig, isDocument } from "../checkers";
import { ComponentConfig, Document } from "../types";

function validate(input: unknown):
  | {
      isValid: true;
      input: Document | ComponentConfig | null | undefined;
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
    input: input as Document | ComponentConfig | null | undefined,
  };
}

export { validate };

export function isLegacyInput(input: unknown): input is ComponentConfig {
  return isComponentConfig(input);
}

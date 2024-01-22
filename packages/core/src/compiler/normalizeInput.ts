import { isDocument } from "../checkers";
import { ComponentConfig } from "../types";
import { isLegacyInput } from "./validation";

export function normalizeInput(input: unknown): ComponentConfig {
  if (isLegacyInput(input)) {
    return input;
  }

  if (isDocument(input) && input.entry) {
    return input.entry;
  }

  throw new Error("Internal error: Can't obtain config from remote document.");
}

import { isDocument } from "../checkers";
import { ComponentConfig } from "../types";
import { isLegacyInput } from "./validation";

export function normalizeInput(input: unknown): ComponentConfig {
  if (isLegacyInput(input)) {
    return input;
  }

  if (isDocument(input) && input.config) {
    if (input.config) {
      return input.config;
    }
  }

  throw new Error("Internal error: Can't obtain config from remote document.");
}

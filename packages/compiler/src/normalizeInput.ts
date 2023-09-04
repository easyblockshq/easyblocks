import { ConfigComponent, isDocument } from "@easyblocks/core";
import { isLegacyInput } from "./validation";

export function normalizeInput(input: unknown): ConfigComponent {
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

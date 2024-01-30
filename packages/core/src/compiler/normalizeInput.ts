import { isDocument } from "../checkers";
import { NoCodeComponentEntry } from "../types";
import { isLegacyInput } from "./validation";

export function normalizeInput(input: unknown): NoCodeComponentEntry {
  if (isLegacyInput(input)) {
    return input;
  }

  if (isDocument(input) && input.entry) {
    return input.entry;
  }

  throw new Error("Internal error: Can't obtain config from remote document.");
}

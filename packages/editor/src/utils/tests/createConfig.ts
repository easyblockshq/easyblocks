import type { NoCodeComponentEntry } from "@easyblocks/core";

function createConfig(
  init: Partial<NoCodeComponentEntry> = {}
): NoCodeComponentEntry {
  return { _template: "", ...init };
}

export { createConfig };

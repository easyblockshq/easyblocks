import type { ConfigComponent } from "@easyblocks/core";

function createConfig(init: Partial<ConfigComponent> = {}): ConfigComponent {
  return { _template: "", ...init };
}

export { createConfig };

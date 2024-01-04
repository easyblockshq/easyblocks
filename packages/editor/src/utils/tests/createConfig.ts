import type { ComponentConfig } from "@easyblocks/core";

function createConfig(init: Partial<ComponentConfig> = {}): ComponentConfig {
  return { _template: "", ...init };
}

export { createConfig };

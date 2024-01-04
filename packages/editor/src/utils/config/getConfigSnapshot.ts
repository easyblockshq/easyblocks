import { ComponentConfig } from "@easyblocks/core";
import { deepClone } from "@easyblocks/utils";

/**
 * Outputs comparable config that is FULL COPY of config
 */
function getConfigSnapshot(config: ComponentConfig): ComponentConfig {
  const strippedConfig = deepClone(config);
  return strippedConfig;
}
export { getConfigSnapshot };

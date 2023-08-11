import { ConfigComponent } from "@easyblocks/core";
import { deepClone } from "@easyblocks/utils";

/**
 * Outputs comparable config that is FULL COPY of config
 */
function getConfigSnapshot(config: ConfigComponent): ConfigComponent {
  const strippedConfig = deepClone(config);
  delete strippedConfig["_variants"];
  return strippedConfig;
}
export { getConfigSnapshot };

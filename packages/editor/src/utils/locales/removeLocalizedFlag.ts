import { ComponentConfig } from "@easyblocks/core";
import { CompilationContextType } from "@easyblocks/core/_internals";
import { configMap } from "../config/configMap";

export function removeLocalizedFlag(
  config: ComponentConfig,
  context: CompilationContextType
) {
  return configMap(config, context, ({ value, schemaProp }) => {
    if (
      (schemaProp.type === "text" && value.id.startsWith("local.")) ||
      schemaProp.type === "component-collection-localised"
    ) {
      delete value.__localized;
    }

    return value;
  });
}

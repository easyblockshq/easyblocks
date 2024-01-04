import { configMap } from "@easyblocks/app-utils";
import { ComponentConfig } from "@easyblocks/core";
import { CompilationContextType } from "@easyblocks/core/_internals";

export function addLocalizedFlag(
  config: ComponentConfig,
  context: CompilationContextType
) {
  return configMap(config, context, ({ value, schemaProp }) => {
    if (
      (schemaProp.type === "text" && value.id?.startsWith("local.")) ||
      schemaProp.type === "component-collection-localised"
    ) {
      return {
        __localized: true,
        ...value,
      };
    }

    return value;
  });
}

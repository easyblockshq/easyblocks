import { ComponentConfig, SchemaProp } from "../types";
import { findComponentDefinition } from "./findComponentDefinition";
import { isSchemaPropComponent } from "./schema";
import { CompilationContextType } from "./types";

type ConfigTraverseCallback = (arg: {
  path: string;
  value: any;
  schemaProp: SchemaProp;
  config: ComponentConfig;
}) => void;

/**
 * Traverses given `config` by invoking given `callback` for each schema prop defined within components from `context`
 */
function configTraverse(
  config: ComponentConfig,
  context: Pick<CompilationContextType, "definitions">,
  callback: ConfigTraverseCallback
): void {
  configTraverseInternal(config, context, callback, "");
}

function configTraverseArray(
  array: ComponentConfig[],
  context: Pick<CompilationContextType, "definitions">,
  callback: ConfigTraverseCallback,
  path: string
) {
  array.forEach((config, index) => {
    configTraverseInternal(config, context, callback, `${path}.${index}`);
  });
}

function configTraverseInternal(
  config: ComponentConfig,
  context: Pick<CompilationContextType, "definitions">,
  callback: ConfigTraverseCallback,
  path: string
) {
  const componentDefinition = findComponentDefinition(config, context);

  if (!componentDefinition) {
    console.warn(
      `[configTraverse] Unknown component definition for: ${config._template}`
    );
    return;
  }

  const pathPrefix = path === "" ? "" : path + ".";

  componentDefinition.schema.forEach((schemaProp) => {
    if (
      isSchemaPropComponent(schemaProp) ||
      schemaProp.type === "component-collection"
    ) {
      callback({
        config,
        value: config[schemaProp.prop],
        path: `${pathPrefix}${schemaProp.prop}`,
        schemaProp,
      });

      configTraverseArray(
        config[schemaProp.prop],
        context,
        callback,
        `${pathPrefix}${schemaProp.prop}`
      );
    } else if (schemaProp.type === "component-collection-localised") {
      callback({
        config,
        value: config[schemaProp.prop],
        path: `${pathPrefix}${schemaProp.prop}`,
        schemaProp,
      });

      for (const locale in config[schemaProp.prop]) {
        configTraverseArray(
          config[schemaProp.prop][locale],
          context,
          callback,
          `${pathPrefix}${schemaProp.prop}.${locale}`
        );
      }
    } else {
      const currentPath = `${pathPrefix}${schemaProp.prop}`;
      callback({
        config,
        path: currentPath,
        value: config[schemaProp.prop],
        schemaProp,
      });
    }
  });
}

export { configTraverse };

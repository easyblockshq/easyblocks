import { ComponentConfig } from "@easyblocks/core";
import { findComponentDefinition } from "../findComponentDefinition";
import { isSchemaPropComponent } from "../schema";
import { CompilationContextType } from "../types";

type TraverseComponentsCallback = (arg: {
  path: string;
  componentConfig: ComponentConfig;
}) => void;
/**
 * Traverses given `config` by invoking given `callback` for each schema prop defined within components from `context`
 */
function traverseComponents(
  config: ComponentConfig,
  context: CompilationContextType,
  callback: TraverseComponentsCallback
): void {
  traverseComponentsInternal(config, context, callback, "");
}

function traverseComponentsArray(
  array: ComponentConfig[],
  context: CompilationContextType,
  callback: TraverseComponentsCallback,
  path: string
) {
  array.forEach((config, index) => {
    traverseComponentsInternal(config, context, callback, `${path}.${index}`);
  });
}

function traverseComponentsInternal(
  componentConfig: ComponentConfig,
  context: CompilationContextType,
  callback: TraverseComponentsCallback,
  path: string
) {
  const componentDefinition = findComponentDefinition(componentConfig, context);

  if (!componentDefinition) {
    console.warn(
      "[traverseComponents] Unknown component definition",
      componentConfig
    );
    return;
  }

  const pathPrefix = path === "" ? "" : path + ".";

  callback({ componentConfig, path });

  componentDefinition.schema.forEach((schemaProp) => {
    if (
      isSchemaPropComponent(schemaProp) ||
      schemaProp.type === "component-collection"
    ) {
      traverseComponentsArray(
        componentConfig[schemaProp.prop],
        context,
        callback,
        `${pathPrefix}${schemaProp.prop}`
      );
    } else if (schemaProp.type === "component-collection-localised") {
      for (const locale in componentConfig[schemaProp.prop]) {
        traverseComponentsArray(
          componentConfig[schemaProp.prop][locale],
          context,
          callback,
          `${pathPrefix}${schemaProp.prop}.${locale}`
        );
      }
    }
  });
}

export { traverseComponents };

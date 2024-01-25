import {
  NoCodeComponentEntry,
  SchemaProp,
  TrulyResponsiveValue,
  isTrulyResponsiveValue,
} from "@easyblocks/core";
import {
  CompilationContextType,
  findComponentDefinition,
} from "@easyblocks/core/_internals";

/**
 * Traverses recursively the config tree (similar to traverseConfig) but behaves like "Array.map". It returns new tree with elements mapped to new ones.
 * Responsive values are mapped "per breakpoint", it smells a bit, maybe in the future we'll have to apply some flag to have option whether we want to disassemble responsives or not.
 */

type ConfigMapCallback = (arg: {
  value: any;
  schemaProp: SchemaProp;
  path: string;
}) => any;

function configMapArray(
  configArray: NoCodeComponentEntry[] | undefined,
  context: CompilationContextType,
  callback: ConfigMapCallback,
  prefix: string
) {
  /**
   * Why this?
   *
   * Sometimes you might need configMap for config that have not yet been normalized. Such config still can be considered correct if it has a component that have a new schema property. Example of this is mergeSingleLocaleConfigsIntoConfig.
   */
  if (configArray === undefined) {
    return;
  }

  if (!Array.isArray(configArray)) {
    return;
  }

  return configArray.map((x, index) =>
    configMapInternal(x, context, callback, `${prefix}.${index}`)
  );
}

function configMap(
  config: NoCodeComponentEntry,
  context: CompilationContextType,
  callback: ConfigMapCallback
): NoCodeComponentEntry {
  return configMapInternal(config, context, callback, "");
}

function configMapInternal(
  config: NoCodeComponentEntry,
  context: CompilationContextType,
  callback: ConfigMapCallback,
  prefix?: string
): NoCodeComponentEntry {
  const componentDefinition = findComponentDefinition(config, context);

  const result: NoCodeComponentEntry = { ...config };

  if (!componentDefinition) {
    console.warn(
      `[configMap] Unknown component definition for: ${config._component}`
    );
    return result;
  }

  prefix = prefix === undefined || prefix === "" ? "" : `${prefix}.`;

  componentDefinition.schema.forEach((schemaProp) => {
    if (schemaProp.type === "component-collection-localised") {
      if (config[schemaProp.prop] === undefined) {
        return;
      }

      result[schemaProp.prop] = {};

      for (const locale in config[schemaProp.prop]) {
        if (locale === "__fallback") {
          continue;
        }

        result[schemaProp.prop][locale] = configMapArray(
          config[schemaProp.prop][locale],
          context,
          callback,
          `${prefix}${schemaProp.prop}.${locale}`
        );
      }

      result[schemaProp.prop] = callback({
        value: result[schemaProp.prop],
        path: `${prefix}${schemaProp.prop}`,
        schemaProp,
      });
    } else if (
      schemaProp.type === "component" ||
      schemaProp.type === "component-collection"
    ) {
      result[schemaProp.prop] = configMapArray(
        config[schemaProp.prop],
        context,
        callback,
        `${prefix}${schemaProp.prop}`
      );

      result[schemaProp.prop] = callback({
        value: result[schemaProp.prop],
        path: `${prefix}${schemaProp.prop}`,
        schemaProp,
      });
    } else {
      if (isTrulyResponsiveValue(result[schemaProp.prop])) {
        const mappedVal: TrulyResponsiveValue<any> = { $res: true };

        for (const key in result[schemaProp.prop]) {
          if (key === "$res") {
            continue;
          }
          mappedVal[key] = callback({
            value: result[schemaProp.prop][key],
            schemaProp,
            path: `${prefix}${schemaProp.prop}.${key}`,
          });
        }
        result[schemaProp.prop] = mappedVal;
      } else {
        result[schemaProp.prop] = callback({
          value: result[schemaProp.prop],
          schemaProp,
          path: `${prefix}${schemaProp.prop}`,
        });
      }
    }
  });

  return result;
}

export { configMap };

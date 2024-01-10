import {
  ComponentConfig,
  UnresolvedResource,
  isTrulyResponsiveValue,
} from "@easyblocks/core";
import {
  CompilationContextType,
  configTraverse,
  isExternalSchemaProp,
} from "@easyblocks/core/_internals";

type ExternalValueWithPositionInConfig = {
  type: string;
  path: string;
  value: UnresolvedResource;
};

export function getAllExternals(
  config: ComponentConfig,
  context: CompilationContextType
): ExternalValueWithPositionInConfig[] {
  const result: ExternalValueWithPositionInConfig[] = [];

  configTraverse(config, context, ({ schemaProp, path, value }) => {
    if (isExternalSchemaProp(schemaProp, context.types)) {
      if (isTrulyResponsiveValue(value)) {
        for (const key in value) {
          if (key === "$res") {
            continue;
          }

          if (!value[key].id) {
            continue;
          }

          result.push({
            type: schemaProp.type,
            value: { ...value[key] },
            path: path + "." + key,
          });
        }
      } else {
        result.push({
          type: schemaProp.type,
          value: { ...value },
          path: path,
        });
      }
    }
  });

  return result;
}

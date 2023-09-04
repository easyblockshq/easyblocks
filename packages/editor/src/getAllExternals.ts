import {
  CompilationContextType,
  configTraverse,
  isResourceSchemaProp,
  isTrulyResponsiveValue,
} from "@easyblocks/app-utils";

import {
  ConfigComponent,
  UnresolvedResource,
  getResourceType,
} from "@easyblocks/core";

type ExternalValueWithPositionInConfig = {
  type: string;
  path: string;
  value: UnresolvedResource;
};

export function getAllExternals(
  config: ConfigComponent,
  context: CompilationContextType
): ExternalValueWithPositionInConfig[] {
  const result: ExternalValueWithPositionInConfig[] = [];

  configTraverse(config, context, ({ schemaProp, path, value }) => {
    if (isResourceSchemaProp(schemaProp)) {
      if (isTrulyResponsiveValue(value)) {
        for (const key in value) {
          if (key === "$res") {
            continue;
          }

          if (!value[key].id) {
            continue;
          }

          result.push({
            type: getResourceType(schemaProp),
            value: { ...value[key] },
            path: path + "." + key,
          });
        }
      } else {
        result.push({
          type: getResourceType(schemaProp),
          value: { ...value },
          path: path,
        });
      }
    }
  });

  return result;
}

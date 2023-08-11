import {
  configTraverse,
  isResourceSchemaProp,
  isTrulyResponsiveValue,
  responsiveValueValues,
} from "@easyblocks/app-utils";
import {
  ResourceWithSchemaProp,
  ShopstoryClientDependencies,
  UnresolvedResource,
} from "@easyblocks/core";
import { normalizeInput } from "../normalizeInput";

import { createCompilationContext } from "../createCompilationContext";
import { normalize } from "../normalize";
import { getRootContainer } from "../getRootContainer";

export const findResources: ShopstoryClientDependencies["findResources"] = (
  input,
  config,
  contextParams
) => {
  // We only obtain `rootContainer` here for purpose of `normalizeInput` and `createCompilationContext`.
  // If these two methods would be removed from `findResources` dependencies, we could remove this.
  const rootContainer = getRootContainer(input, contextParams);
  const inputConfigComponent = normalizeInput(input, rootContainer);
  const resourcesWithSchemaProps: ResourceWithSchemaProp[] = [];
  const compilationContext = createCompilationContext(
    config,
    contextParams,
    rootContainer
  );
  const normalizedConfig = normalize(inputConfigComponent, compilationContext);

  configTraverse(
    normalizedConfig,
    compilationContext,
    ({ value, schemaProp }) => {
      if (!isResourceSchemaProp(schemaProp)) {
        return;
      }

      if (isTrulyResponsiveValue<UnresolvedResource | undefined>(value)) {
        responsiveValueValues(value).forEach((currentValue) => {
          if (!currentValue) {
            return;
          }

          resourcesWithSchemaProps.push({
            schemaProp,
            resource: currentValue,
          });
        });
      } else {
        resourcesWithSchemaProps.push({
          schemaProp,
          resource: value,
        });
      }
    }
  );

  return resourcesWithSchemaProps;
};

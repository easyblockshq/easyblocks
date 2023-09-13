import {
  configTraverse,
  isResourceSchemaProp,
  isTrulyResponsiveValue,
  responsiveValueEntries,
} from "@easyblocks/app-utils";
import {
  getResourceId,
  ResourceWithSchemaProp,
  ShopstoryClientDependencies,
  UnresolvedResource,
} from "@easyblocks/core";
import { assertDefined } from "@easyblocks/utils";
import { createCompilationContext } from "../createCompilationContext";
import { getRootContainer } from "../getRootContainer";
import { normalize } from "../normalize";
import { normalizeInput } from "../normalizeInput";

export const findResources: ShopstoryClientDependencies["findResources"] = (
  input,
  config,
  contextParams
) => {
  // We only obtain `rootContainer` here for purpose of `normalizeInput` and `createCompilationContext`.
  // If these two methods would be removed from `findResources` dependencies, we could remove this.
  const rootContainer = getRootContainer(input, contextParams);
  const inputConfigComponent = normalizeInput(input);
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
    ({ config, value, schemaProp }) => {
      if (!isResourceSchemaProp(schemaProp)) {
        return;
      }

      const configId =
        assertDefined(normalizedConfig._id) === assertDefined(config._id)
          ? "$"
          : assertDefined(config._id);

      if (isTrulyResponsiveValue<UnresolvedResource | undefined>(value)) {
        responsiveValueEntries(value).forEach(([breakpoint, currentValue]) => {
          if (currentValue === undefined) {
            return;
          }

          resourcesWithSchemaProps.push({
            id: getResourceId(configId, schemaProp.prop, breakpoint),
            schemaProp,
            resource: currentValue,
          });
        });
      } else {
        resourcesWithSchemaProps.push({
          id: getResourceId(configId, schemaProp.prop),
          schemaProp,
          resource: value,
        });
      }
    }
  );

  return resourcesWithSchemaProps;
};

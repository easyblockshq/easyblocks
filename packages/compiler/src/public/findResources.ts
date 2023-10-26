import {
  configTraverse,
  isExternalSchemaProp,
  isTrulyResponsiveValue,
  responsiveValueEntries,
} from "@easyblocks/app-utils";
import {
  CompilerModule,
  ExternalReference,
  ExternalSchemaProp,
  ExternalWithSchemaProp,
  getExternalReferenceLocationKey,
  isLocalTextReference,
} from "@easyblocks/core";
import { assertDefined } from "@easyblocks/utils";
import { createCompilationContext } from "../createCompilationContext";
import { normalize } from "../normalize";
import { normalizeInput } from "../normalizeInput";

export const findExternals: CompilerModule["findExternals"] = (
  input,
  config,
  contextParams
) => {
  const inputConfigComponent = normalizeInput(input);
  const externalsWithSchemaProps: ExternalWithSchemaProp[] = [];
  const compilationContext = createCompilationContext(
    config,
    contextParams,
    contextParams.rootContainer
  );
  const normalizedConfig = normalize(inputConfigComponent, compilationContext);

  configTraverse(
    normalizedConfig,
    compilationContext,
    ({ config, value, schemaProp }) => {
      // This kinda tricky, because "text" is a special case. It can be either local or external.
      // To prevent false positives, we need to check if it's local text reference and make sure that we won't
      // treat "text" that's actually external as non external.
      if (
        (schemaProp.type === "text" && isLocalTextReference(value, "text")) ||
        (schemaProp.type !== "text" && !isExternalSchemaProp(schemaProp))
      ) {
        return;
      }

      const configId =
        assertDefined(normalizedConfig._id) === assertDefined(config._id)
          ? "$"
          : assertDefined(config._id);

      if (isTrulyResponsiveValue<ExternalReference | undefined>(value)) {
        responsiveValueEntries(value).forEach(([breakpoint, currentValue]) => {
          if (currentValue === undefined) {
            return;
          }

          externalsWithSchemaProps.push({
            id: getExternalReferenceLocationKey(
              configId,
              schemaProp.prop,
              breakpoint
            ),
            schemaProp: schemaProp as ExternalSchemaProp,
            externalReference: currentValue,
          });
        });
      } else {
        externalsWithSchemaProps.push({
          id: getExternalReferenceLocationKey(configId, schemaProp.prop),
          schemaProp: schemaProp as ExternalSchemaProp,
          externalReference: value,
        });
      }
    }
  );

  return externalsWithSchemaProps;
};

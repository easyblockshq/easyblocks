import { isEmptyRenderableContent } from "./checkers";
import { responsiveValueMap } from "./responsiveness";
import type {
  ExternalData,
  ExternalReference,
  ExternalReferenceNonEmpty,
  ExternalSchemaProp,
  FetchOutputCompoundResources,
  ResponsiveValue,
} from "./types";

export function getExternalValue(externalDataValue: ExternalData[string]) {
  if ("error" in externalDataValue) {
    return;
  }

  return externalDataValue.value;
}

export function isLocalTextReference(
  resource: { id: string | null },
  type: string
) {
  if (resource.id === null) {
    return false;
  }

  return type === "text" && resource.id.startsWith("local.");
}

export function getExternalReferenceLocationKey(
  configId: string,
  fieldName: string,
  deviceId?: string
) {
  let resourceId = `${configId}.${fieldName}`;

  if (deviceId) {
    resourceId += `.${deviceId}`;
  }

  return resourceId;
}

export function getResolvedExternalDataValue(
  externalData: ExternalData,
  configId: string,
  fieldName: string,
  value: ExternalReferenceNonEmpty
) {
  const externalReferenceLocationKey =
    typeof value.id === "string" && value.id.startsWith("$.")
      ? value.id
      : getExternalReferenceLocationKey(configId, fieldName);

  const externalValue = externalData[externalReferenceLocationKey];

  if (externalValue === undefined || "error" in externalValue) {
    return;
  }

  return externalValue;
}

export function resolveExternalValue(
  responsiveResource: ResponsiveValue<ExternalReference>,
  configId: string,
  schemaProp: ExternalSchemaProp,
  externalData: ExternalData
) {
  return responsiveValueMap(responsiveResource, (r, breakpointIndex) => {
    if (r.id) {
      // If resource field has `key` defined and its `id` starts with "$.", it means that it's a reference to the
      // root resource and we need to look for the resource with the same id as the root resource.
      const locationKey =
        r.key && typeof r.id === "string" && r.id.startsWith("$.")
          ? r.id
          : getExternalReferenceLocationKey(
              configId,
              schemaProp.prop,
              breakpointIndex
            );
      const externalDataValue = externalData[locationKey];

      let resourceValue: ReturnType<typeof getExternalValue>;

      if (externalDataValue) {
        resourceValue = getExternalValue(externalDataValue);
      }

      if (
        externalDataValue === undefined ||
        isEmptyRenderableContent(resourceValue)
      ) {
        return;
      }

      if ("error" in externalDataValue) {
        return;
      }

      if (isCompoundExternalDataValue(externalDataValue)) {
        if (!r.key) {
          return;
        }

        const resolvedResourceValue = externalDataValue.value[r.key].value;

        if (!resolvedResourceValue) {
          return;
        }

        return resolvedResourceValue;
      }

      return resourceValue;
    }

    return;
  });
}

export function isCompoundExternalDataValue(
  value: ExternalData[string]
): value is FetchOutputCompoundResources[string] {
  return (
    ("type" in value && value.type === "object" && "value" in value) ||
    "error" in value
  );
}

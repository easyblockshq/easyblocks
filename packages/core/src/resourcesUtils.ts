import type { ExternalData, ResourceParams, ResourceSchemaProp } from "./types";

export function getResourceFetchParams(
  schemaProp: ResourceSchemaProp
): ResourceParams | undefined {
  if (schemaProp.type === "text") {
    return;
  }

  return schemaProp.fetchParams;
}

export function getResourceType(schemaProp: ResourceSchemaProp): string {
  if (schemaProp.type === "resource") {
    return schemaProp.resourceType;
  }

  return schemaProp.type;
}

export function getResourceValue(externalDataValue: ExternalData[string]) {
  if (externalDataValue.error !== null) {
    return;
  }

  return "values" in externalDataValue
    ? externalDataValue.values
    : externalDataValue.value;
}

export function isLocalTextResource(
  resource: { id: string | null },
  type: string
) {
  if (resource.id === null) {
    return false;
  }

  return type === "text" && resource.id.startsWith("local.");
}

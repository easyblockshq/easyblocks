import type { ExternalData, FetchOutputCompoundResources } from "./types";

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

export function isCompoundExternalDataValue(
  value: ExternalData[string]
): value is FetchOutputCompoundResources[string] {
  return (
    ("type" in value && value.type === "object" && "value" in value) ||
    "error" in value
  );
}

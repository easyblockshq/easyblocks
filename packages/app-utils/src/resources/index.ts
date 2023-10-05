import type {
  ExternalData,
  ExternalDataCompoundResourceResolvedResult,
  ExternalReference,
  ExternalReferenceEmpty,
  FetchOutputCompoundResources,
  RejectedResource,
  ResolvedResource,
} from "@easyblocks/core";

export type ResolvedResourceProp<ResourceValue = unknown> =
  | (Omit<ResolvedResource, "value"> & { value: ResourceValue })
  | (Omit<RejectedResource, "value"> & { value: undefined });

export function isCompoundExternalDataValue(
  value: ExternalData[string]
): value is FetchOutputCompoundResources[string] {
  return (
    ("type" in value && value.type === "object" && "value" in value) ||
    "error" in value
  );
}

export function isResolvedCompoundExternalDataValue(
  value: ExternalData[string]
): value is ExternalDataCompoundResourceResolvedResult {
  return "type" in value && value.type === "object" && "value" in value;
}

export function isIdReferenceToDocumentExternalValue(id: string) {
  return id.startsWith("$.");
}

export function isEmptyExternalReference(
  externalDataConfigEntry: ExternalReference
): externalDataConfigEntry is ExternalReferenceEmpty {
  return externalDataConfigEntry.id === null;
}

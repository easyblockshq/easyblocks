import type {
  ExternalData,
  RejectedResource,
  ResolvedResource,
  FetchOutputCompoundResources,
  UnresolvedResource,
  UnresolvedResourceEmpty,
  ExternalDataCompoundResourceResolvedResult,
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

export function isIdReferenceToDocumentExternalData(id: string) {
  return id.startsWith("$.");
}

export function isEmptyExternalDataConfigEntry(
  externalDataConfigEntry: UnresolvedResource
): externalDataConfigEntry is UnresolvedResourceEmpty {
  return externalDataConfigEntry.id === null;
}

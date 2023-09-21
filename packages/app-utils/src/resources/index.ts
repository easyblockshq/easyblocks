import type {
  ExternalData,
  PendingResource,
  RejectedResource,
  ResolvedResource,
  FetchOutputCompoundResources,
} from "@easyblocks/core";

export type ResolvedResourceProp<ResourceValue = unknown> =
  | (Omit<PendingResource, "value"> & { value: undefined })
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
): value is Exclude<FetchOutputCompoundResources[string], { error: Error }> {
  return "type" in value && value.type === "object" && "value" in value;
}

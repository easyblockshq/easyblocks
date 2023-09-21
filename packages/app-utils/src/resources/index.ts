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
  return value.type === "object" && "values" in value && "error" in value;
}

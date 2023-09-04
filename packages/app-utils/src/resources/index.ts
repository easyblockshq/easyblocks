import type {
  PendingResource,
  RejectedResource,
  ResolvedResource,
} from "@easyblocks/core";

export type ResolvedResourceProp<ResourceValue = unknown> =
  | (Omit<PendingResource, "value"> & { value: undefined })
  | (Omit<ResolvedResource, "value"> & { value: ResourceValue })
  | (Omit<RejectedResource, "value"> & { value: undefined });

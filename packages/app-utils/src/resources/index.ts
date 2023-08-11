import type {
  PendingResource,
  RejectedResource,
  ResolvedResource,
} from "@easyblocks/core";

export type ResolvedResourceProp<ResourceValue = unknown> =
  | (Omit<PendingResource, "values"> & { value: undefined })
  | (Omit<ResolvedResource, "values"> & { value: ResourceValue })
  | (Omit<RejectedResource, "values"> & { value: undefined });

import type {
  Resource,
  ResourceParams,
  ResourceSchemaProp,
  UnresolvedResource,
} from "./types";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getResourceValue(resource: Resource): any {
  if (resource.status !== "success") {
    return;
  }

  return resource.value;
}

export function isLocalTextResource(
  resource: UnresolvedResource,
  type: string
) {
  if (resource.id === null) {
    return false;
  }

  return type === "text" && resource.id.startsWith("local.");
}

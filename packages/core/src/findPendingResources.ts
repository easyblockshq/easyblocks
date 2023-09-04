import { ResourcesStore } from "./createResourcesStore";
import {
  getResourceFetchParams,
  getResourceType,
  isLocalTextResource,
} from "./resourcesUtils";
import type { ResourceSchemaProp, ResourceWithSchemaProp } from "./types";

type PendingResource = {
  id: string;
  schemaProp: ResourceSchemaProp;
  resource: {
    id: string;
    type: string;
    widgetId: string;
    fetchParams?: Record<string, unknown>;
  };
};

export function findPendingResources(
  resourcesWithSchemaProps: ResourceWithSchemaProp[],
  resourcesStore: ResourcesStore
): Array<PendingResource> {
  const result: Array<PendingResource> = [];

  resourcesWithSchemaProps.forEach(({ id, resource, schemaProp }) => {
    const type = getResourceType(schemaProp);
    const fetchParams = getResourceFetchParams(schemaProp);

    if (
      resource.id === null ||
      isLocalTextResource(resource, type) ||
      isResourceSettled(id, type, resourcesStore)
    ) {
      return;
    }

    if (result.some((staged) => staged.id === id)) {
      return;
    }

    result.push({
      id,
      schemaProp,
      resource: {
        id: resource.id,
        type,
        fetchParams,
        widgetId: resource.widgetId,
      },
    });
  });

  return result;
}

function isResourceSettled(
  id: string,
  type: string,
  resourcesStore: ResourcesStore
) {
  const resource = resourcesStore.get(id, type);
  return resource && resource.status !== "loading";
}

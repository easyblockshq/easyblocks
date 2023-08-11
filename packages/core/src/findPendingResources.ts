import type { FetchingContext } from "./createFetchingContext";
import { ResourcesStore } from "./createResourcesStore";
import {
  getResourceFetchParams,
  getResourceIdentifier,
  getResourceTransformerHash,
  getResourceType,
  getResourceVariant,
  isLocalTextResource,
} from "./resourcesUtils";
import type {
  ResourceInfo,
  ResourceParams,
  ResourceSchemaProp,
  ResourceVariant,
  ResourceWithSchemaProp,
  UnresolvedResource,
  UnresolvedResourceNonEmpty,
} from "./types";

type PendingResource = {
  schemaProp: ResourceSchemaProp;
  resource: {
    id: string;
    info?: ResourceInfo;
    type: string;
    fetchParams?: Record<string, unknown>;
    variant?: string;
  };
};

type PendingResources = Record<string, Array<PendingResource>>;

export function findPendingResources(
  resourcesWithSchemaProps: ResourceWithSchemaProp[],
  resourcesStore: ResourcesStore,
  context: FetchingContext
): PendingResources {
  const stagedForMap: PendingResources = {};

  resourcesWithSchemaProps.forEach(({ resource, schemaProp }) => {
    const type = getResourceType(schemaProp, context, resource);
    const fetchParams = getResourceFetchParams(resource, schemaProp, context);

    if (!isSyncRequired(resource, type, fetchParams, resourcesStore)) {
      return;
    }

    if (!stagedForMap[type]) {
      stagedForMap[type] = [];
    }

    const variant = getResourceVariant(resource, schemaProp, context);
    const transformHash = getResourceTransformerHash(
      resource,
      schemaProp,
      variant
    );

    if (
      isResourceAlreadyStaged(
        stagedForMap[type],
        resource,
        fetchParams,
        transformHash,
        variant
      )
    ) {
      return;
    }

    stagedForMap[type].push({
      schemaProp,
      resource: {
        id: resource.id,
        type,
        info: resource.info,
        fetchParams,
        variant: resource.variant,
      },
    });
  });

  return stagedForMap;
}

function isSyncRequired(
  resourceValue: UnresolvedResource,
  type: string,
  params: Record<string, any> | undefined,
  resourcesStore: ResourcesStore
): resourceValue is UnresolvedResourceNonEmpty {
  if (resourceValue.id === null || isLocalTextResource(resourceValue, type)) {
    return false;
  }

  const resource = resourcesStore.get(
    getResourceIdentifier(resourceValue.id, resourceValue.info, params),
    type
  );

  return !resource || resource.status === "loading";
}

function isResourceAlreadyStaged(
  stagedResources: Array<PendingResource>,
  resource: UnresolvedResourceNonEmpty,
  fetchParams: ResourceParams | undefined,
  transformKey: string | undefined,
  variant: ResourceVariant | undefined
) {
  return stagedResources.some((staged) => {
    const transformHash = getResourceTransformerHash(
      staged.resource,
      staged.schemaProp,
      variant
    );

    return (
      getResourceIdentifier(
        staged.resource.id,
        staged.resource.info,
        staged.resource.fetchParams
      ) === getResourceIdentifier(resource.id, resource.info, fetchParams) &&
      transformKey === transformHash
    );
  });
}

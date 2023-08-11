import { assertDefined, sortObject } from "@easyblocks/utils";
import type { FetchingContext } from "./createFetchingContext";
import { ResourcesStore } from "./createResourcesStore";
import type {
  Resource,
  ResourceIdentity,
  ResourceInfo,
  ResourceParams,
  ResourceSchemaProp,
  ResourceVariant,
  SerializableResourceIdentifier,
  UnresolvedResource,
  UnresolvedResourceNonEmpty,
} from "./types";

export function getResourceFetchParams(
  resource: UnresolvedResource,
  schemaProp: ResourceSchemaProp,
  context: Pick<
    FetchingContext,
    "image" | "video" | "imageVariants" | "videoVariants"
  >
): ResourceParams | undefined {
  if (schemaProp.type === "text") {
    return;
  }

  const variant = getResourceVariant(resource, schemaProp, context);

  if (schemaProp.type === "image" || schemaProp.type === "video") {
    if (variant) {
      return variant.fetchParams;
    }

    return context[schemaProp.type].fetchParams;
  }

  if ("variants" in schemaProp) {
    return variant!.fetchParams;
  }

  return schemaProp.fetchParams;
}

export function getResourceIdentifier(
  id: string,
  info?: ResourceInfo,
  fetchParams?: ResourceParams
): string {
  if (info || fetchParams) {
    const serializableIdentifier: SerializableResourceIdentifier = {
      id,
    };

    if (info) {
      serializableIdentifier.info = sortObject(info) as ResourceInfo;
    }

    if (fetchParams) {
      serializableIdentifier.fetchParams = sortObject(
        fetchParams
      ) as ResourceParams;
    }

    return JSON.stringify(serializableIdentifier);
  }

  return id;
}

export function getResourceType(
  schemaProp: ResourceSchemaProp,
  context: Pick<
    FetchingContext,
    "image" | "video" | "imageVariants" | "videoVariants"
  >,
  resource: UnresolvedResource
): string {
  if (schemaProp.type === "resource") {
    if ("variants" in schemaProp) {
      const variant = getResourceVariant(resource, schemaProp, context);

      if (!variant) {
        throw new Error(
          `Missing "${resource.variant}" resource variant within resource schema prop "${schemaProp.prop}"`
        );
      }

      return variant.resourceType;
    }

    return schemaProp.resourceType;
  }

  if (schemaProp.type === "image" || schemaProp.type === "video") {
    if (resource.variant) {
      const mediaVariant = assertDefined(
        getResourceVariant(resource, schemaProp, context)
      );

      return mediaVariant.resourceType;
    }

    const imageOrVideoCompilationType = context[schemaProp.type];

    if (!imageOrVideoCompilationType) {
      throw new Error(
        `Missing "${schemaProp.type}" property within Shopstory config.`
      );
    }

    return imageOrVideoCompilationType.resourceType;
  }

  return schemaProp.type;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getResourceValue(
  resource: Resource,
  transformHash?: string
): any {
  if (resource.status !== "success") {
    return;
  }

  if (transformHash) {
    return resource.values[transformHash];
  }

  return resource.values["default"];
}

export function getResourceTransformerHash(
  value: UnresolvedResourceNonEmpty,
  schemaProp: ResourceSchemaProp,
  variant: ResourceVariant | undefined
): string | undefined {
  if (variant) {
    return variant.transformHash;
  }

  if ("transformHash" in schemaProp) {
    return schemaProp.transformHash;
  }

  return;
}

export function getResourceVariant(
  value: UnresolvedResource | undefined,
  schemaProp: ResourceSchemaProp,
  context: Pick<
    FetchingContext,
    "image" | "video" | "imageVariants" | "videoVariants"
  >
): ResourceVariant | undefined {
  if (
    schemaProp.type === "text" ||
    (schemaProp.type === "resource" && "resourceType" in schemaProp)
  ) {
    return;
  }

  if (schemaProp.type === "image" || schemaProp.type === "video") {
    const mediaVariantsProperty = `${schemaProp.type}Variants` as const;
    const mediaVariant = context[mediaVariantsProperty].find((variant) =>
      value?.variant ? variant.id === value.variant : true
    );

    if (!mediaVariant) {
      throw new Error(
        `Missing ${schemaProp.type} variant for schema prop "${schemaProp.prop}"`
      );
    }

    return mediaVariant;
  }

  if ("variants" in schemaProp) {
    if (!value?.variant) {
      // Even though `defaultVariantId` is a required property from TS perspective, we perform sanity check if
      // it's not missing. Without a valid `defaultVariantId` we're unable to perform fetch when there are `variants`
      // available on resource schema prop.
      if (!schemaProp.defaultVariantId) {
        throw new Error(
          `Missing "defaultVariantId" property for "${schemaProp.prop}" prop". Make sure to add it to your custom resource schema prop.`
        );
      }

      const defaultVariant = schemaProp.variants.find(
        (v) => v.id === schemaProp.defaultVariantId
      );

      if (!defaultVariant) {
        throw new Error(
          `Missing default resource variant "${schemaProp.defaultVariantId}" for "${schemaProp.prop}" prop"`
        );
      }

      return defaultVariant;
    }

    const variant = schemaProp.variants.find((v) => v.id === value.variant);

    if (!variant) {
      throw new Error(
        `Missing resource variant "${value.variant}" for "${schemaProp.prop}" prop"`
      );
    }

    return variant;
  }

  throw new Error(`Unhandled resource type`);
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

export function isPendingResource(
  resourcesStore: ResourcesStore,
  resource: UnresolvedResource,
  type: string,
  params: ResourceParams | undefined
): boolean {
  if (resource.id === null) {
    // empty values are never dirty, empty items don't need fetching any data
    return false;
  }

  // local values are never dirty, they don't need to be fetched
  if (isLocalTextResource(resource, type)) {
    return false;
  }

  const resourceHash = getResourceIdentifier(
    resource.id,
    resource.info,
    params
  );

  return resourcesStore.get(resourceHash, type) === undefined;
}

export function resourceByIdentity<
  ResourcePredicateValue extends ResourceIdentity = ResourceIdentity
>(id: string, type: string, info?: ResourceInfo, fetchParams?: ResourceParams) {
  return (resource: ResourceIdentity): resource is ResourcePredicateValue => {
    return (
      getResourceIdentifier(
        resource.id,
        resource.info,
        resource.fetchParams
      ) === getResourceIdentifier(id, info, fetchParams) &&
      resource.type === type
    );
  };
}

import {
  createFetchingContext,
  FetchingContext,
} from "./createFetchingContext";
import { ResourcesStore } from "./createResourcesStore";
import { FetchResourceError } from "./FetchResourceError";
import { IApiClient } from "./infrastructure/apiClient";
import {
  getResourceIdentifier,
  getResourceTransformerHash,
  getResourceVariant,
  resourceByIdentity,
} from "./resourcesUtils";
import { ShopstoryClient } from "./ShopstoryClient";
import type {
  Config,
  ContextParams,
  DefaultFetchFunction,
  FetchFunctionOptions,
  FetchResourcesInput,
  FetchResourcesOutput,
  LauncherPlugin,
  ResolvedResource,
  ResourceInfo,
  ResourceSchemaProp,
  ResourceTransformer,
  UnresolvedResourceNonEmpty,
} from "./types";

export async function syncResources({
  stagedForMap,
  resourcesStore,
  shopstoryClient,
  apiClient,
  isEditing,
  config,
  contextParams,
}: {
  stagedForMap: StagedForMapType;
  resourcesStore: ResourcesStore;
  shopstoryClient: ShopstoryClient;
  apiClient: IApiClient;
  isEditing?: boolean;
  config: Config;
  contextParams: ContextParams;
}): Promise<void> {
  if (isEditing) {
    savePendingResources(resourcesStore, stagedForMap);
  }

  const fetchingContext = createFetchingContext(config);

  const fetchersResults = await runFetchers({
    config,
    contextParams,
    isEditing: !!isEditing,
    stagedForMap,
    shopstoryClient,
    apiClient,
    fetchingContext,
  });

  saveSyncedResources(
    resourcesStore,
    stagedForMap,
    fetchersResults,
    fetchingContext
  );
}

type StagedResource = {
  schemaProp: ResourceSchemaProp;
  resource: {
    id: string;
    info?: ResourceInfo;
    type: string;
    fetchParams?: Record<string, unknown>;
    variant?: string;
  };
};

type StagedForMapType = {
  [mapperId: string]: Array<StagedResource>;
};

type SyncedResourceOutput = FetchResourcesOutput & { transformHash?: string };

function getDefaultFetcherForType(
  type: string,
  fetchingContext: FetchingContext
): DefaultFetchFunction | undefined {
  if (type === "text") {
    if (!fetchingContext.text) {
      throw new Error(
        "There is external text in config but there is no fetch function"
      );
    }

    return fetchingContext.text.defaultFetch;
  } else if (type === "image" || type === "video") {
    return fetchingContext.resourceTypes[fetchingContext[type].resourceType]
      ?.defaultFetch;
  }

  return fetchingContext.resourceTypes[type]?.defaultFetch;
}

function getFetcherForType(type: string, compilationContext: FetchingContext) {
  if (type === "text") {
    if (!compilationContext.text?.fetch) {
      throw new Error(
        "There is external text in config but there is no fetch function"
      );
    }

    return compilationContext.text.fetch;
  } else if (type === "image" || type === "video") {
    return compilationContext.resourceTypes[
      compilationContext[type].resourceType
    ]?.fetch;
  }

  return compilationContext.resourceTypes[type]?.fetch;
}

const BULLET_CHAR = String.fromCharCode(8226);

async function runFetchers({
  stagedForMap,
  config,
  contextParams,
  shopstoryClient,
  apiClient,
  isEditing,
  fetchingContext,
}: {
  stagedForMap: StagedForMapType;
  config: Config;
  contextParams: ContextParams;
  shopstoryClient: ShopstoryClient;
  apiClient: IApiClient;
  isEditing: boolean;
  fetchingContext: FetchingContext;
}): Promise<Array<SyncedResourceOutput>> {
  const isStrictMode = fetchingContext.strict ?? true;
  // By default, fetching during editing doesn't throw up whole app because that would be bad, but we throw when user
  // is fetching resources outside of editor ex. during their build of app.
  // This behavior is good, but there are cases where user wouldn't want it.
  // User can disable default behavior by setting `strict: false` in Shopstory config
  const shouldContinueOnFetchError = isEditing || !isStrictMode;

  const fetchResourcesResults: Array<SyncedResourceOutput> = [];
  const promises: Array<Promise<any>> = [];

  for (const type in stagedForMap) {
    const stagedResources = stagedForMap[type];
    const fetcherInputs =
      removeDuplicated(stagedResources).map(buildResourceInput);
    const defaultFetcher = getDefaultFetcherForType(type, fetchingContext);
    const customFetcher = getFetcherForType(type, fetchingContext);
    const fetcher = customFetcher ?? defaultFetcher;

    if (!fetcher) {
      const missingFetcherErrorMessage = `Missing fetch function for type "${type}". If this is custom resource type, make sure to provide fetch method for it within Shopstory config.`;

      if (shouldContinueOnFetchError) {
        console.error(missingFetcherErrorMessage);
        continue;
      }

      throw new Error(missingFetcherErrorMessage);
    }

    const fetcherParams: FetchFunctionOptions = {
      ...contextParams,
      isEditing,
      shopstoryClient,
      apiClient,
      projectId: config.projectId,
    };

    const fetchResources = fetcher(fetcherInputs, fetcherParams);

    promises.push(
      new Promise((resolve, reject) => {
        fetchResources
          .then(async (fetchResourcesResult) => {
            if (customFetcher && !defaultFetcher) {
              if (!Array.isArray(fetchResourcesResult)) {
                const nonArrayResultErrorMessage = `Result of fetch function for type "${type}" is not an array, got "${JSON.stringify(
                  fetchResourcesResult
                )}" instead. Make sure to return an array of resources from your custom fetch.`;

                if (shouldContinueOnFetchError) {
                  console.error(nonArrayResultErrorMessage);
                  resolve(null);
                } else {
                  reject(new Error(nonArrayResultErrorMessage));
                }

                return;
              }

              if (!validateFetchResults(fetchResourcesResult)) {
                const invalidFetchResultsErrorMessage = `Results of fetch function for type "${type}" are invalid. Each result should be one of:\n${BULLET_CHAR} undefined\n${BULLET_CHAR} same as resource input\n${BULLET_CHAR} resolved resource with "value" or "error" property.`;

                if (shouldContinueOnFetchError) {
                  console.error(invalidFetchResultsErrorMessage);
                  resolve(null);
                } else {
                  reject(new Error(invalidFetchResultsErrorMessage));
                }

                return;
              }
            }

            let combinedResourcesResult = [...fetchResourcesResult];

            let remainingUnresolvedResources = getUnresolvedResources(
              fetcherInputs,
              combinedResourcesResult
            );

            if (
              customFetcher &&
              defaultFetcher &&
              remainingUnresolvedResources.length > 0
            ) {
              try {
                const defaultFetchResourcesResult = await defaultFetcher(
                  remainingUnresolvedResources,
                  fetcherParams
                );

                combinedResourcesResult = [
                  ...defaultFetchResourcesResult,
                  ...fetchResourcesResult.filter(isResourceResolved),
                ];

                const unresolvedResources = getUnresolvedResources(
                  fetcherInputs,
                  combinedResourcesResult
                );

                if (unresolvedResources.length > 0) {
                  const unresolvedResourcesErrorMessage = `Default fetch for type "${type}" didn't resolve remaining unresolved resources returned from custom fetch. This is probably Shopstory error.\n\nBelow is the list of unresolved resources:\n${JSON.stringify(
                    unresolvedResources,
                    null,
                    2
                  )}`;

                  if (shouldContinueOnFetchError) {
                    console.error(unresolvedResourcesErrorMessage);
                    resolve(null);
                  } else {
                    reject(new Error(unresolvedResourcesErrorMessage));
                  }

                  return;
                }
              } catch (error: unknown) {
                console.error(error);

                const defaultFetchErrorMessage = `Above error occurred in default fetch function for type "${type}". This is probably Shopstory error.`;

                if (shouldContinueOnFetchError) {
                  console.error(defaultFetchErrorMessage);
                  resolve(null);
                } else {
                  reject(new Error(defaultFetchErrorMessage));
                }

                return;
              }
            }

            let resolvedResourcesResults =
              combinedResourcesResult.filter<FetchResourcesOutput>(
                (result): result is FetchResourcesOutput =>
                  result !== undefined && isResourceResolved(result)
              );

            const typePostFetch =
              fetchingContext.resourceTypes[type]?.postFetch;

            if (typePostFetch) {
              try {
                resolvedResourcesResults = await typePostFetch(
                  resolvedResourcesResults,
                  fetcherParams
                );
              } catch (error: unknown) {
                console.error(error);

                const postFetchErrorMessage = `postFetch function for resource of type "${type}" finished with error above. This is not Shopstory error.\n\nBelow is the input for which the method failed:\n${JSON.stringify(
                  resolvedResourcesResults,
                  null,
                  2
                )}`;

                if (shouldContinueOnFetchError) {
                  console.error(postFetchErrorMessage);
                  resolve(null);
                } else {
                  reject(new Error(postFetchErrorMessage));
                }

                return;
              }
            }

            remainingUnresolvedResources = getUnresolvedResources(
              fetcherInputs,
              resolvedResourcesResults
            );

            if (remainingUnresolvedResources.length > 0) {
              const unresolvedResourcesParagraph = `Below is the list of remaining unresolved resources:\n${JSON.stringify(
                remainingUnresolvedResources,
                null,
                2
              )}`;

              const unresolvedResourcesErrorMessage = `Fetching resources for type "${type}" didn't resolve all resources. This is not Shopstory error.\n\n${unresolvedResourcesParagraph}\n\n`;

              if (shouldContinueOnFetchError) {
                console.error(unresolvedResourcesErrorMessage);
              } else {
                reject(new Error(unresolvedResourcesErrorMessage));
              }
            }

            const currentTypeFetchResourcesResults = transformResolvedResources(
              stagedResources,
              resolvedResourcesResults
            );

            fetchResourcesResults.push(...currentTypeFetchResourcesResults);

            resolve(null);

            function transformResolvedResources(
              stagedResources: Array<StagedResource>,
              results: Array<FetchResourcesOutput>
            ) {
              const ret: Array<SyncedResourceOutput> = [];

              for (const stagedResource of stagedResources) {
                const stagedResourceResult = results.find((result) =>
                  resourceByIdentity(
                    result.id,
                    result.type,
                    result.info,
                    result.fetchParams
                  )(stagedResource.resource)
                );

                if (!stagedResourceResult) {
                  continue;
                }

                let transformedResult: any;

                try {
                  const transformer = getTransformer(
                    stagedResource.schemaProp,
                    stagedResource.resource,
                    fetchingContext
                  );

                  transformedResult =
                    transformer && stagedResourceResult.value
                      ? transformer(stagedResourceResult.value, fetcherParams)
                      : stagedResourceResult.value;
                } catch (error: unknown) {
                  console.error(error);

                  const typeTransformErrorMessage = `Transformer for type "${type}" and id "${stagedResourceResult.id}" finished with error. This is not Shopstory error.`;

                  if (shouldContinueOnFetchError) {
                    console.error(typeTransformErrorMessage);
                    resolve(null);
                  } else {
                    reject(new Error(typeTransformErrorMessage));
                  }
                }

                /**
                 * Here we're checking whether mappedResult is serializable. Right now with JSON.stringify.
                 */
                try {
                  JSON.stringify(transformedResult);
                  const variant = getResourceVariant(
                    stagedResource.resource,
                    stagedResource.schemaProp,
                    fetchingContext
                  );

                  const transformHash = getResourceTransformerHash(
                    stagedResource.resource,
                    stagedResource.schemaProp,
                    variant
                  );

                  ret.push({
                    ...stagedResourceResult,
                    value: transformedResult,
                    transformHash,
                  });
                } catch (error) {
                  const circularReferencesErrorMessage = `Resource of type "${type}" and id "${stagedResourceResult.id}" resolved to object with circular references. This is not Shopstory error.`;

                  if (shouldContinueOnFetchError) {
                    console.error(circularReferencesErrorMessage);
                  } else {
                    reject(new Error(circularReferencesErrorMessage));
                  }
                }
              }

              return ret;
            }
          })
          .catch((error: unknown) => {
            console.error(error);

            const fetchErrorMessage = `Fetch function for type "${type}" finished with error above. This is not Shopstory error.\n\nBelow is the input for which the resource fetch failed:\n${JSON.stringify(
              fetcherInputs,
              null,
              2
            )}`;

            if (shouldContinueOnFetchError) {
              console.error(fetchErrorMessage);
              resolve(null);
            } else {
              reject(new Error(fetchErrorMessage));
            }
          });
      })
    );
  }

  await Promise.all(promises);

  return fetchResourcesResults;
}

function saveSyncedResources(
  resourcesStore: ResourcesStore,
  stagedResourcesMap: StagedForMapType,
  syncedResources: Array<SyncedResourceOutput>,
  fetchingContext: FetchingContext
) {
  resourcesStore.batch(() => {
    for (const resourceType in stagedResourcesMap) {
      const stagedResources = stagedResourcesMap[resourceType];
      const syncedResourcesOfType = syncedResources.filter(
        (resource) => resource.type === resourceType
      );

      // We MUST iterate over all staged resources because some resources could be missing from synced resources
      // if ex. some fetch function has thrown ending up with no resource result.
      // Maybe we should improve the way we handle those kind of errors and actually put the rejected resource into synced resources.
      stagedResources.forEach((stagedResource) => {
        const stagedResourceIdentifier = getResourceIdentifier(
          stagedResource.resource.id,
          stagedResource.resource.info,
          stagedResource.resource.fetchParams
        );

        const relatedSyncedResource = syncedResourcesOfType.find(
          (syncedResource) => {
            const syncedResourceIdentifier = getResourceIdentifier(
              syncedResource.id,
              syncedResource.info,
              syncedResource.fetchParams
            );

            const resourceTransformHash = getResourceTransformerHash(
              stagedResource.resource,
              stagedResource.schemaProp,
              getResourceVariant(
                stagedResource.resource,
                stagedResource.schemaProp,
                fetchingContext
              )
            );

            return (
              stagedResourceIdentifier === syncedResourceIdentifier &&
              syncedResource.transformHash === resourceTransformHash
            );
          }
        );

        if (!relatedSyncedResource) {
          resourcesStore.set(stagedResourceIdentifier, {
            id: stagedResource.resource.id,
            status: "error",
            error: new FetchResourceError(stagedResource.resource.id),
            type: resourceType,
            values: undefined,
            info: stagedResource.resource.info,
            fetchParams: stagedResource.resource.fetchParams,
          });

          return;
        }

        if (relatedSyncedResource.value) {
          const transformHash =
            relatedSyncedResource.transformHash ?? "default";
          const storedResource = resourcesStore.get(
            stagedResourceIdentifier,
            resourceType
          );

          if (storedResource) {
            if (
              storedResource.status == "success" ||
              storedResource.status == "loading"
            ) {
              const newValues = Object.assign(
                {},
                storedResource.status === "success"
                  ? storedResource.values
                  : {},
                {
                  [transformHash]: relatedSyncedResource.value,
                }
              );

              const updatedStoredResource: ResolvedResource = {
                ...storedResource,
                status: "success",
                values: newValues,
              };

              resourcesStore.set(
                stagedResourceIdentifier,
                updatedStoredResource
              );
            }
          } else {
            resourcesStore.set(stagedResourceIdentifier, {
              id: relatedSyncedResource.id,
              status: "success",
              error: null,
              type: relatedSyncedResource.type,
              values: {
                [transformHash]: relatedSyncedResource.value,
              },
              info: relatedSyncedResource.info,
              fetchParams: relatedSyncedResource.fetchParams,
            });
          }
        } else {
          const resourceError = relatedSyncedResource.error
            ? relatedSyncedResource.error
            : new FetchResourceError(relatedSyncedResource.id);

          resourcesStore.set(stagedResourceIdentifier, {
            id: stagedResource.resource.id,
            status: "error",
            error: resourceError,
            type: resourceType,
            values: undefined,
            info: stagedResource.resource.info,
            fetchParams: stagedResource.resource.fetchParams,
          });
        }
      });
    }
  });
}

function savePendingResources(
  resourcesStore: ResourcesStore,
  stagedForMap: StagedForMapType
) {
  resourcesStore.batch(() => {
    for (const type in stagedForMap) {
      const stagedInstances = stagedForMap[type];

      stagedInstances.forEach((stagedInstance) => {
        const resourceId = getResourceIdentifier(
          stagedInstance.resource.id,
          stagedInstance.resource.info,
          stagedInstance.resource.fetchParams
        );

        resourcesStore.set(resourceId, {
          id: stagedInstance.resource.id,
          status: "loading",
          type,
          error: null,
          values: undefined,
          fetchParams: stagedInstance.resource.fetchParams,
        });
      });
    }
  });
}

function getUnresolvedResources(
  resourcesToFetch: Array<FetchResourcesInput>,
  fetchedResources: Array<
    FetchResourcesInput | FetchResourcesOutput | undefined
  >
) {
  const unresolvedResources: Array<FetchResourcesInput> = [];

  resourcesToFetch.forEach((resource) => {
    const resourceResult = fetchedResources.find(
      (result) =>
        result !== undefined &&
        getResourceIdentifier(result.id, result.info, result.fetchParams) ===
          getResourceIdentifier(
            resource.id,
            resource.info,
            resource.fetchParams
          )
    );

    if (!resourceResult) {
      unresolvedResources.push(resource);
      return;
    }

    if (!isResourceResolved(resourceResult)) {
      unresolvedResources.push(resource);
    }
  });

  return unresolvedResources;
}

function isResourceResolved(
  fetchResourceResult: FetchResourcesInput | FetchResourcesOutput | undefined
): fetchResourceResult is FetchResourcesOutput {
  return (
    fetchResourceResult !== undefined &&
    ("value" in fetchResourceResult || "error" in fetchResourceResult)
  );
}

function validateFetchResults(results: Array<unknown>) {
  return results.every((result) => {
    return (
      (typeof result === "object" && result !== null) || result === undefined
    );
  });
}

function removeDuplicated(resources: Array<StagedResource>) {
  const uniqueResources: Array<StagedResource> = [];

  resources.forEach((resource) => {
    const isDuplicate = uniqueResources.some((uniqueResource) => {
      const currentUniqueStagedResourceIdentifier = getResourceIdentifier(
        uniqueResource.resource.id,
        uniqueResource.resource.info,
        uniqueResource.resource.fetchParams
      );
      const resourceIdentifier = getResourceIdentifier(
        resource.resource.id,
        resource.resource.info,
        resource.resource.fetchParams
      );

      return currentUniqueStagedResourceIdentifier === resourceIdentifier;
    });

    if (!isDuplicate) {
      uniqueResources.push(resource);
    }
  });

  return uniqueResources;
}

function buildResourceInput(
  stagedResource: StagedResource
): FetchResourcesInput {
  const resourceInput: FetchResourcesInput = {
    id: stagedResource.resource.id,
    type: stagedResource.resource.type,
  };

  if (stagedResource.resource.info) {
    resourceInput.info = stagedResource.resource.info;
  }

  if (stagedResource.resource.fetchParams) {
    resourceInput.fetchParams = stagedResource.resource.fetchParams;
  }

  return resourceInput;
}

function getTransformer(
  schemaProp: ResourceSchemaProp,
  value: UnresolvedResourceNonEmpty,
  compilationContext: FetchingContext
): ResourceTransformer<unknown, unknown> | undefined {
  if (schemaProp.type === "text") {
    return;
  }

  const variant = getResourceVariant(value, schemaProp, compilationContext);

  if (schemaProp.type === "image" || schemaProp.type === "video") {
    if (variant) {
      return variant.transform;
    }

    return compilationContext[schemaProp.type].transform;
  }

  if ("variants" in schemaProp) {
    return variant?.transform;
  }

  return schemaProp.transform;
}

/**
 *
 * @deprecated
 */
export function getLauncherPlugin(config: Config): LauncherPlugin | undefined {
  const plugins = config.plugins ?? [];

  const launcherPlugins = plugins.filter(
    (plugin): plugin is LauncherPlugin => plugin.launcher !== undefined
  );

  if (launcherPlugins.length > 1) {
    throw new Error("more than one launcher plugin!!!");
  }

  return launcherPlugins[0];
}

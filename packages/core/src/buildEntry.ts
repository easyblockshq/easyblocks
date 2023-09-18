import { ResourcesStore } from "./createResourcesStore";
import {
  getResourceFetchParams,
  getResourceType,
  isLocalTextResource,
} from "./resourcesUtils";
import {
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  ComponentConfig,
  Config,
  FetchInputResources,
  ResourceWithSchemaProp,
  ShopstoryClientDependencies,
} from "./types";

function buildEntry({
  entry,
  config,
  contextParams,
  compiler,
  resourcesStore,
}: {
  entry: ComponentConfig;
  config: Config;
  contextParams: { locale: string; rootContainer: string };
  compiler: ShopstoryClientDependencies;
  resourcesStore: ResourcesStore;
}): {
  renderableContent: CompiledShopstoryComponentConfig;
  meta: CompilationMetadata;
  externalData: FetchInputResources;
  configAfterAuto?: ComponentConfig;
} {
  const compilationResult = compiler.compile(entry, config, contextParams);
  const resourcesWithSchemaProps = compiler.findResources(
    entry,
    config,
    contextParams
  );
  const externalData = findPendingExternalData(
    resourcesWithSchemaProps,
    resourcesStore
  );

  return {
    renderableContent: compilationResult.compiled,
    meta: compilationResult.meta,
    externalData,
    configAfterAuto: compilationResult.configAfterAuto,
  };
}

export { buildEntry };

function findPendingExternalData(
  resourcesWithSchemaProps: Array<ResourceWithSchemaProp>,
  resourcesStore: ResourcesStore
): FetchInputResources {
  const pendingExternalData: FetchInputResources = {};

  resourcesWithSchemaProps.forEach(({ id, resource, schemaProp }) => {
    const type = getResourceType(schemaProp);
    const fetchParams = getResourceFetchParams(schemaProp);

    if (
      resource.id === null ||
      isLocalTextResource(resource, type) ||
      isResourceSettled(id, resourcesStore)
    ) {
      return;
    }

    if (pendingExternalData[id]) {
      return;
    }

    pendingExternalData[id] = {
      externalId: resource.id,
      type,
      widgetId: resource.widgetId,
      fetchParams,
    };
  });

  return pendingExternalData;
}

function isResourceSettled(id: string, resourcesStore: ResourcesStore) {
  const resource = resourcesStore.get(id);
  return resource && resource.status !== "loading";
}

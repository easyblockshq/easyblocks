import { ResourcesStore } from "./createResourcesStore";
import {
  getResourceFetchParams,
  getResourceType,
  isLocalTextResource,
} from "./resourcesUtils";
import {
  ChangedExternalData,
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  ComponentConfig,
  Config,
  ResourceWithSchemaProp,
  ShopstoryClientDependencies,
} from "./types";

type BuildEntryOptions = {
  entry: ComponentConfig;
  config: Config;
  contextParams: { locale: string; rootContainer: string };
  compiler: ShopstoryClientDependencies;
  resourcesStore: ResourcesStore;
  isExternalDataChanged?: (
    externalData: {
      id: string;
      externalId: string | null;
    },
    defaultIsExternalDataChanged: (externalData: {
      id: string;
      externalId: string | null;
    }) => boolean
  ) => boolean;
};

function buildEntry({
  entry,
  config,
  contextParams,
  compiler,
  resourcesStore,
  isExternalDataChanged,
}: BuildEntryOptions): {
  renderableContent: CompiledShopstoryComponentConfig;
  meta: CompilationMetadata;
  externalData: ChangedExternalData;
  configAfterAuto?: ComponentConfig;
} {
  if (!compiler.validate(entry)) {
    throw new Error("Invalid entry");
  }

  const compilationResult = compiler.compile(entry, config, contextParams);
  const resourcesWithSchemaProps = compiler.findResources(
    entry,
    config,
    contextParams
  );
  const externalData = findChangedExternalData(
    resourcesWithSchemaProps,
    resourcesStore,
    isExternalDataChanged
  );

  return {
    renderableContent: compilationResult.compiled,
    meta: compilationResult.meta,
    externalData,
    configAfterAuto: compilationResult.configAfterAuto,
  };
}

export { buildEntry };

function findChangedExternalData(
  resourcesWithSchemaProps: Array<ResourceWithSchemaProp>,
  resourcesStore: ResourcesStore,
  isExternalDataPending: BuildEntryOptions["isExternalDataChanged"]
) {
  const changedExternalData: ChangedExternalData = {};

  function defaultIsExternalDataPending(
    id: string,
    resource: { id: string; externalId: string | null },
    type: string
  ) {
    return (
      resource.externalId !== null &&
      !isLocalTextResource(
        {
          id: resource.externalId,
        },
        type
      ) &&
      !isResourceSettled(id, resourcesStore) &&
      !resource.externalId?.startsWith("$.")
    );
  }

  resourcesWithSchemaProps.forEach(({ id, resource, schemaProp }) => {
    const type = getResourceType(schemaProp);
    const fetchParams = getResourceFetchParams(schemaProp);

    const externalData = {
      id,
      externalId: resource.id,
    };

    if (isExternalDataPending) {
      if (
        !isExternalDataPending(externalData, (resource) => {
          return defaultIsExternalDataPending(id, resource, type);
        })
      ) {
        return;
      }
    } else {
      return defaultIsExternalDataPending(id, externalData, type);
    }

    if (changedExternalData[id]) {
      return;
    }

    changedExternalData[id] = {
      externalId: resource.id,
      type,
      widgetId: resource.widgetId,
      fetchParams,
    };
  });

  return changedExternalData;
}

function isResourceSettled(id: string, resourcesStore: ResourcesStore) {
  const resource = resourcesStore.get(id);
  return resource && resource.status !== "loading";
}

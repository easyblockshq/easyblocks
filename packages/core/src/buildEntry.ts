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
  ExternalData,
  ResourceWithSchemaProp,
  ShopstoryClientDependencies,
} from "./types";

type BuildEntryOptions = {
  entry: ComponentConfig;
  config: Config;
  contextParams: { locale: string; rootContainer: string };
  compiler: ShopstoryClientDependencies;
  externalData: ExternalData;
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
  externalData,
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
  const pendingExternalData = findChangedExternalData(
    resourcesWithSchemaProps,
    externalData,
    isExternalDataChanged
  );

  return {
    renderableContent: compilationResult.compiled,
    meta: compilationResult.meta,
    externalData: pendingExternalData,
    configAfterAuto: compilationResult.configAfterAuto,
  };
}

export { buildEntry };

function findChangedExternalData(
  resourcesWithSchemaProps: Array<ResourceWithSchemaProp>,
  externalData: ExternalData,
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
      !externalData[id] &&
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

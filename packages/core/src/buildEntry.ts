import { isLocalTextReference } from "./resourcesUtils";
import type {
  ChangedExternalData,
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  ComponentConfig,
  Config,
  ExternalData,
  ExternalParams,
  ExternalSchemaProp,
  ExternalWithSchemaProp,
  CompilerModule,
} from "./types";

type BuildEntryOptions = {
  entry: ComponentConfig;
  config: Config;
  contextParams: { locale: string; rootContainer: string };
  compiler: CompilerModule;
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
  const resourcesWithSchemaProps = compiler.findExternals(
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
  resourcesWithSchemaProps: Array<ExternalWithSchemaProp>,
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
      !isLocalTextReference(
        {
          id: resource.externalId,
        },
        type
      ) &&
      !externalData[id] &&
      !resource.externalId?.startsWith("$.")
    );
  }

  resourcesWithSchemaProps.forEach(({ id, externalReference, schemaProp }) => {
    const fetchParams = getExternalFetchParams(schemaProp);

    const externalData = {
      id,
      externalId: externalReference.id,
    };

    if (isExternalDataPending) {
      if (
        !isExternalDataPending(externalData, (resource) => {
          return defaultIsExternalDataPending(id, resource, schemaProp.type);
        })
      ) {
        return;
      }
    } else {
      const isPendingDefault = defaultIsExternalDataPending(
        id,
        externalData,
        schemaProp.type
      );

      if (!isPendingDefault) {
        return;
      }
    }

    if (changedExternalData[id]) {
      return;
    }

    changedExternalData[id] = {
      externalId: externalReference.id,
      type: schemaProp.type,
      widgetId: externalReference.widgetId,
      fetchParams,
    };
  });

  return changedExternalData;
}

function getExternalFetchParams(
  schemaProp: ExternalSchemaProp
): ExternalParams | undefined {
  if (schemaProp.type === "text") {
    return;
  }

  return schemaProp.fetchParams;
}

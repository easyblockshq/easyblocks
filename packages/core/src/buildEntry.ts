import { isLocalTextReference } from "./resourcesUtils";
import type {
  RequestedExternalData,
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  CompilerModule,
  NoCodeComponentEntry,
  Config,
  ExternalData,
  ExternalParams,
  ExternalReference,
  ExternalSchemaProp,
  ExternalWithSchemaProp,
} from "./types";
import { compile, findExternals, validate } from "./compiler";

type BuildEntryOptions = {
  entry: NoCodeComponentEntry;
  config: Config;
  locale: string;
  compiler?: CompilerModule;
  externalData?: ExternalData;
  isExternalDataChanged?: (
    externalData: {
      id: string;
      externalId: ExternalReference["id"];
    },
    defaultIsExternalDataChanged: (externalData: {
      id: string;
      externalId: ExternalReference["id"];
    }) => boolean
  ) => boolean;
};

const defaultCompiler: CompilerModule = {
  compile,
  findExternals,
  validate,
};

function buildEntry({
  entry,
  config,
  locale,
  compiler = defaultCompiler,
  externalData = {},
  isExternalDataChanged,
}: BuildEntryOptions): {
  renderableContent: CompiledShopstoryComponentConfig;
  meta: CompilationMetadata;
  externalData: RequestedExternalData;
  configAfterAuto?: NoCodeComponentEntry;
} {
  if (!compiler.validate(entry)) {
    throw new Error("Invalid entry");
  }

  const contextParams = { locale };
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
  const changedExternalData: RequestedExternalData = {};

  function defaultIsExternalDataPending(
    id: string,
    resource: { id: string; externalId: ExternalReference["id"] },
    type: string
  ) {
    // If null, then it's empty external value and it's not pending
    if (resource.externalId === null) {
      return false;
    }

    // If it's already fetched, then it's not pending
    if (externalData[id]) {
      return false;
    }

    // If id is a string and it's either local text reference or a reference to document's data, then it's not pending
    if (
      typeof resource.externalId === "string" &&
      (isLocalTextReference(
        {
          id: resource.externalId,
        },
        type
      ) ||
        resource.externalId.startsWith("$."))
    ) {
      return false;
    }

    return true;
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
      id: externalReference.id,
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

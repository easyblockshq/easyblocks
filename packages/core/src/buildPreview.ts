import { getAppUrlRoot, serialize } from "@easyblocks/utils";
import { buildEntry } from "./buildEntry";
import { compile, findExternals, validate } from "./compiler";
import type {
  ChangedExternalData,
  CompilationMetadata,
  CompilerModule,
  ComponentConfig,
  Config,
  ContextParams,
} from "./types";

export async function buildPreview(
  documentId: string,
  projectId: string,
  width: number | undefined,
  widthAuto: boolean | undefined,
  accessToken: string,
  config: Config,
  contextParams: ContextParams
): Promise<{
  renderableDocument: {
    renderableContent: any;
    meta: CompilationMetadata;
    configAfterAuto: ComponentConfig | undefined;
  };
  externalData: ChangedExternalData;
}> {
  const response = await fetch(
    `${getAppUrlRoot()}/api/projects/${projectId}/documents/${documentId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-shopstory-access-token": accessToken,
      },
    }
  );

  const data = await response.json();

  const compiler: CompilerModule = {
    compile,
    findExternals,
    validate,
  };

  const { externalData, renderableContent, meta, configAfterAuto } =
    await buildEntry({
      compiler,
      contextParams: {
        ...contextParams,
        rootContainer: data.root_container,
      },
      entry: {
        _id: "root",
        _template: "$ComponentContainer",
        widthAuto: widthAuto ?? false,
        width: width ?? 5000,
        Component: [data.config.config],
      },
      config: { ...config, accessToken },
      externalData: {},
    });

  return {
    renderableDocument: {
      renderableContent,
      meta: serialize(meta),
      configAfterAuto,
    },
    externalData,
  };
}

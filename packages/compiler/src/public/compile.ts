import { mergeCompilationMeta } from "@easyblocks/app-utils";
import { CompilationMetadata, CompilerModule } from "@easyblocks/core";
import { compileInternal } from "../compileInternal";
import { createCompilationContext } from "../createCompilationContext";
import { getRootContainer } from "../getRootContainer";
import { normalizeInput } from "../normalizeInput";

export const compile: CompilerModule["compile"] = (
  content,
  config,
  contextParams
) => {
  let resultMeta: CompilationMetadata = {
    // @ts-expect-error We can leave `devices` and `locale` undefined because these values are set in `compileInternal`.
    vars: {},
    code: {},
  };

  const rootContainer = getRootContainer(content, contextParams);
  const compilationContext = createCompilationContext(
    config,
    contextParams,
    rootContainer
  );

  if (!content) {
    content = compilationContext.rootContainers.find(
      (c) => c.id === rootContainer
    )?.defaultConfig;
  }

  const inputConfigComponent = normalizeInput(content);

  const { meta, compiled, configAfterAuto } = compileInternal(
    inputConfigComponent,
    compilationContext
  );

  resultMeta = mergeCompilationMeta(resultMeta, meta);

  return {
    compiled,
    configAfterAuto,
    meta: resultMeta,
  };
};

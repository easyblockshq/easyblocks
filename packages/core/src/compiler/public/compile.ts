import { mergeCompilationMeta } from "../mergeCompilationMeta";
import { CompilationMetadata, CompilerModule } from "../../types";
import { compileInternal } from "../compileInternal";
import { createCompilationContext } from "../createCompilationContext";
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

  const compilationContext = createCompilationContext(
    config,
    contextParams,
    content._template
  );

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

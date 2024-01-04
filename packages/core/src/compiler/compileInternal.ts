import {
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  ComponentConfig,
} from "../types";
import { CompilationCache } from "./CompilationCache";
import { normalize } from "./normalize";
import { buildFullTheme } from "./buildFullTheme";
import { compileComponent } from "./compileComponent";
import { CompilationContextType, ContextProps } from "./types";

export type CompileInternalReturnType = {
  compiled: CompiledShopstoryComponentConfig;
  meta: CompilationMetadata;
  configAfterAuto?: ComponentConfig;
};

export function compileInternal(
  configComponent: ComponentConfig,
  compilationContext: CompilationContextType,
  cache = new CompilationCache()
): CompileInternalReturnType {
  const normalizedConfig = normalize(configComponent, compilationContext);

  const compilationContextWithFullTheme: CompilationContextType = {
    ...compilationContext,
    theme: buildFullTheme(compilationContext.theme),
  };

  const meta: CompilationMetadata = {
    vars: {
      definitions: {
        links: [],
        actions: [],
        components: [],
        textModifiers: [],
      },
      devices: compilationContextWithFullTheme.devices,
      locale: compilationContextWithFullTheme.contextParams.locale,
    },
  };

  const activeDocumentType = compilationContext.documentTypes.find(
    (container) => container.id === compilationContext.documentType
  );
  const contextProps: ContextProps = {};

  if (activeDocumentType?.widths) {
    contextProps.$width = activeDocumentType.widths;
    contextProps.$widthAuto = false;
  }

  const compilationArtifacts = compileComponent(
    normalizedConfig,
    compilationContextWithFullTheme,
    contextProps,
    meta,
    {},
    cache
  );

  const ret: CompileInternalReturnType = {
    compiled:
      compilationArtifacts.compiledComponentConfig as CompiledShopstoryComponentConfig,
    meta: {
      vars: meta.vars,
    },
  };

  if (compilationContext.isEditing) {
    return {
      ...ret,
      configAfterAuto: compilationArtifacts.configAfterAuto,
    };
  }

  return ret;
}

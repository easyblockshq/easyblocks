import {
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  ConfigComponent,
} from "@easyblocks/core";
import { CompilationContextType, ContextProps } from "@easyblocks/app-utils";
import { CompilationCache } from "./CompilationCache";
import { normalize } from "./normalize";
import { buildFullTheme } from "./buildFullTheme";
import { compileComponent } from "./compileComponent";

export type CompileInternalReturnType = {
  compiled: CompiledShopstoryComponentConfig;
  meta: CompilationMetadata;
  configAfterAuto?: ConfigComponent;
};

export function compileInternal(
  configComponent: ConfigComponent,
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

  const activeRootContainer = compilationContext.rootContainers.find(
    (container) => container.id === compilationContext.rootContainer
  );
  const contextProps: ContextProps = {};

  if (activeRootContainer?.widths) {
    contextProps.$width = activeRootContainer.widths;
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

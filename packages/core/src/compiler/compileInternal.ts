import {
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  NoCodeComponentEntry,
} from "../types";
import { CompilationCache } from "./CompilationCache";
import { normalize } from "./normalize";
import { compileComponent } from "./compileComponent";
import { CompilationContextType, ContextProps } from "./types";
import { getDevicesWidths } from "./devices";

type CompileInternalReturnType = {
  compiled: CompiledShopstoryComponentConfig;
  meta: CompilationMetadata;
  configAfterAuto?: NoCodeComponentEntry;
};

export function compileInternal(
  configComponent: NoCodeComponentEntry,
  compilationContext: CompilationContextType,
  cache = new CompilationCache()
): CompileInternalReturnType {
  const normalizedConfig = normalize(configComponent, compilationContext);

  const meta: CompilationMetadata = {
    vars: {
      definitions: {
        links: [],
        actions: [],
        components: [],
        textModifiers: [],
      },
      devices: compilationContext.devices,
      locale: compilationContext.contextParams.locale,
    },
  };

  const contextProps: ContextProps = {
    $width: getDevicesWidths(compilationContext.devices),
    $widthAuto: {
      $res: true,
      ...Object.fromEntries(
        compilationContext.devices.map((d) => [d.id, false])
      ),
    },
  };

  const compilationArtifacts = compileComponent(
    normalizedConfig,
    compilationContext,
    contextProps,
    meta,
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

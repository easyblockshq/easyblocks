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
import Box from "./built/builders/react/Box";
import CanvasRoot from "./built/builders/react/CanvasRoot";
import ComponentBuilder from "./built/builders/react/ComponentBuilder";
import EditableComponentBuilderEditor from "./built/builders/react/EditableComponentBuilder.editor";
import EditableComponentBuilderClient from "./built/builders/react/EditableComponentBuilder.client";
import Placeholder from "./built/builders/react/Placeholder.editor";
import MissingComponent from "./built/builders/react/MissingComponent";

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
    code: {},
    vars: {
      definitions: {
        links: [],
        actions: [],
        components: [],
        textModifiers: [],
      },
    },
  };

  const activeRootContainer = compilationContext.rootContainers.find(
    (container) => container.id === compilationContext.rootContainer
  );
  const contextProps: ContextProps = {};

  if (activeRootContainer?.widths) {
    contextProps.$width = activeRootContainer.widths;
  }

  const compilationArtifacts = compileComponent(
    normalizedConfig,
    compilationContextWithFullTheme,
    contextProps,
    meta,
    cache
  );

  const isEditing = !!compilationContext.isEditing;

  let builtinCode: Record<string, string> = {
    ComponentBuilder,
    EditableComponentBuilderClient,
    MissingComponent,
    Box,
  };

  if (isEditing) {
    builtinCode = {
      ...builtinCode,
      EditableComponentBuilderEditor,
      MissingComponent,
      Placeholder,
      CanvasRoot,
    };
  }

  const ret: CompileInternalReturnType = {
    compiled:
      compilationArtifacts.compiledComponentConfig as CompiledShopstoryComponentConfig,
    meta: {
      code: {
        ...meta.code,
        ...builtinCode,
      },
      vars: {
        ...meta.vars,
        devices: compilationContextWithFullTheme.devices,
        image: compilationContextWithFullTheme.image,
        video: compilationContextWithFullTheme.video,
        locale: compilationContextWithFullTheme.contextParams.locale,
        imageVariants: compilationContextWithFullTheme.imageVariants,
        videoVariants: compilationContextWithFullTheme.videoVariants,
      },
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

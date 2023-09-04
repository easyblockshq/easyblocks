import { mergeCompilationMeta } from "@easyblocks/app-utils";
import {
  CompilationMetadata,
  ShopstoryClientDependencies,
} from "@easyblocks/core";
import { compileInternal } from "../compileInternal";
import { createCompilationContext } from "../createCompilationContext";
import { getRootContainer } from "../getRootContainer";
import { normalizeInput } from "../normalizeInput";

export const compile: ShopstoryClientDependencies["compile"] = (
  items,
  config,
  contextParams
) => {
  if (items.length === 0) {
    const compilationContext = createCompilationContext(
      config,
      contextParams,
      "content"
    );

    const resultMeta: CompilationMetadata = {
      code: {},
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

    return {
      items: [],
      meta: resultMeta,
    };
  }

  let resultMeta: CompilationMetadata = {
    vars: {},
    code: {},
  };

  return {
    items: items.map(({ content, options }) => {
      const rootContainer = getRootContainer(content, options);
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

      const inputConfigComponent = normalizeInput(content, options.mode);

      const { meta, ...rest } = compileInternal(
        inputConfigComponent,
        compilationContext
      );

      resultMeta = mergeCompilationMeta(resultMeta, meta);
      return rest;
    }),
    meta: resultMeta,
  };
};

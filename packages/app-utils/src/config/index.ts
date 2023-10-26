import {
  ComponentConfig,
  EmptyRenderableContent,
  NonEmptyRenderableContent,
  RenderableContent,
} from "@easyblocks/core";
import { CompilationContextType } from "../types";
import { isCompiledComponentConfig } from "./isCompiledComponentConfig";
import { traverseComponents } from "./traverseComponents";

export * from "./configFindAllPaths";
export * from "./configMap";
export * from "./configTraverse";
export * from "./duplicateConfig";
export * from "./isComponentConfig";
export * from "./traverseComponents";
export {
  isCompiledComponentConfig,
  isRenderableContent,
  isNonEmptyRenderableContent,
  isEmptyRenderableContent,
  getComponentMainType,
};

function isRenderableContent(input: unknown): input is RenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    (isCompiledComponentConfig(
      (input as { renderableContent: unknown }).renderableContent
    ) ||
      (input as { renderableContent: unknown }).renderableContent === null)
  );
}

function isNonEmptyRenderableContent(
  input: unknown
): input is NonEmptyRenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    isCompiledComponentConfig(
      (input as { renderableContent: unknown }).renderableContent
    )
  );
}

function isEmptyRenderableContent(
  input: unknown
): input is EmptyRenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    (input as { renderableContent: unknown }).renderableContent === null
  );
}

const getComponentMainType = (componentTypes: string[]) => {
  let type;

  if (
    componentTypes.includes("action") ||
    componentTypes.includes("actionLink")
  ) {
    type = "action";
  } else if (componentTypes.includes("card")) {
    type = "card";
  } else if (componentTypes.includes("symbol")) {
    type = "icon";
  } else if (componentTypes.includes("button")) {
    type = "button";
  } else if (
    componentTypes.includes("section") ||
    componentTypes.includes("token")
  ) {
    type = "section";
  } else if (componentTypes.includes("item")) {
    type = "item";
  } else if (
    componentTypes.includes("image") ||
    componentTypes.includes("$image")
  ) {
    type = "image";
  } else if (componentTypes.includes("actionTextModifier")) {
    type = "actionTextModifier";
  } else {
    type = "item";
  }

  return type;
};

export function findConfigById(
  config: ComponentConfig,
  context: CompilationContextType,
  configId: string
): ComponentConfig | undefined {
  let foundConfig: ComponentConfig | undefined;

  traverseComponents(config, context, ({ componentConfig }) => {
    if (foundConfig) {
      return;
    }

    if (componentConfig._id === configId) {
      foundConfig = componentConfig;
    }
  });

  return foundConfig;
}

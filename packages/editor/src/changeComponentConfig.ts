import { findComponentDefinition, isTemplate } from "@easyblocks/app-utils";
import { ConfigComponent } from "@easyblocks/core";
import { EditorContextType } from "./EditorContext";

export function changeComponentConfig(
  previousConfig: ConfigComponent,
  newConfig: ConfigComponent,
  editorContext: EditorContextType
) {
  const previousComponentDefinition = findComponentDefinition(
    previousConfig,
    editorContext
  )!;
  const newComponentDefinition = findComponentDefinition(
    newConfig,
    editorContext
  )!;

  newConfig = {
    ...newConfig,
    _itemProps: previousConfig?._itemProps,
  };

  const isPreviousButton = previousComponentDefinition.tags.includes("button");
  const isNewButton = newComponentDefinition.tags.includes("button");

  if (isPreviousButton && isNewButton) {
    const isNewCustom = !newConfig._template.startsWith("$");
    const isNewIconButton = newConfig._template === "$IconButton";

    const previousSymbol: ConfigComponent | undefined =
      previousConfig.symbol[0];

    const defaultIcon = editorContext
      .templates!["symbol"].filter(isTemplate)
      .find((x) => x.config._template === "$icon")!;

    let symbol: ConfigComponent | undefined = undefined;
    if (previousSymbol) {
      symbol = { ...previousSymbol };
    } else {
      if (isNewIconButton) {
        symbol = defaultIcon.config;
      }
    }

    return {
      ...newConfig,
      symbol: symbol ? [symbol] : [],
      label: {
        ...previousConfig.label,
      },
    };
  }

  return newConfig;
}

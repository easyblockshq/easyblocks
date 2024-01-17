import type {
  ComponentConfig,
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "../../../../types";
import { findComponentDefinitionById } from "../../../findComponentDefinition";
import type {
  CompilationContextType,
  InternalTextModifierDefinition,
} from "../../../types";

const DEFAULT_FONT_VALUES = {
  fontWeight: "initial",
  fontStyle: "initial",
};

export interface RichTextPartValues {
  color: string;
  font: Record<string, any>;
  value: string;
  action: [ComponentConfig] | [];
  actionTextModifier: [ComponentConfig] | [];
}

export function richTextPartStyles({
  values: { color, font, action, actionTextModifier },
  __COMPILATION_CONTEXT__,
}: NoCodeComponentStylesFunctionInput<RichTextPartValues> & {
  __COMPILATION_CONTEXT__: any;
}): NoCodeComponentStylesFunctionResult {
  const { modifierStyles } = getTextModifierStyles(
    actionTextModifier,
    __COMPILATION_CONTEXT__
  );

  const fontWithDefaults = {
    ...DEFAULT_FONT_VALUES,
    ...font,
  };

  return {
    styled: {
      Text: {
        __as: "span",
        color,
        ...fontWithDefaults,
        ...modifierStyles,
        ...(action.length > 0 &&
          !__COMPILATION_CONTEXT__.isEditing && { pointerEvents: "auto" }),
        "& *": {
          fontFamily: "inherit",
          fontStyle: "inherit",
          color: "inherit",
          ...modifierStyles,
        },
      },
    },
  };
}

function getTextModifierStyles(
  modifier: [ComponentConfig] | [],
  compilationContext: CompilationContextType
) {
  let modifierStyles: Record<string, unknown> = {};
  let childStyles: Record<string, unknown> | undefined;

  if (modifier.length === 1) {
    const modifierDefinition = findComponentDefinitionById(
      modifier[0]._template,
      compilationContext
    ) as InternalTextModifierDefinition | undefined;

    if (modifierDefinition) {
      modifierStyles = modifierDefinition.apply(modifier[0]);
      childStyles = modifierDefinition.childApply?.(modifier[0]);
    }
  }

  return {
    modifierStyles,
    childStyles,
  };
}

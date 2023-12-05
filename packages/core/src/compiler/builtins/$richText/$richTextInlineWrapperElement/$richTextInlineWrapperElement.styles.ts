import {
  CompiledTextModifier,
  ConfigComponent,
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "../../../../types";
import { findComponentDefinitionById } from "../../../findComponentDefinition";
import {
  CompilationContextType,
  InternalTextModifierDefinition,
} from "../../../types";

export type RichTextActionElementValues = {
  elements: Array<unknown>;
  action: [ConfigComponent] | [];
  // textModifier: [CompiledTextModifier] | [];
  actionTextModifier: [CompiledTextModifier] | [];
};

export function richTextInlineWrapperElementStyles({
  values: { elements, actionTextModifier },
  isEditing,
  __COMPILATION_CONTEXT__,
}: NoCodeComponentStylesFunctionInput<RichTextActionElementValues> & {
  __COMPILATION_CONTEXT__: any;
}): NoCodeComponentStylesFunctionResult {
  const { modifierStyles, childStyles } = getTextModifierStyles(
    actionTextModifier,
    __COMPILATION_CONTEXT__
  );

  const contextProps =
    childStyles !== undefined
      ? {
          elements: {
            itemProps: elements.map(() => ({
              __modifierStyles: childStyles,
            })),
          },
        }
      : {};

  return {
    styled: {
      Link: {
        __as: isEditing ? "span" : "a",
        pointerEvents: "auto",
        ...modifierStyles,
      },
    },
    props: contextProps,
  };
}

function getTextModifierStyles(
  modifier: [CompiledTextModifier] | [],
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

import type {
  CompiledTextModifier,
  ConfigComponent,
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { getTextModifierStyles } from "../../../getTextModifierStyles";

export type RichTextActionElementValues = {
  elements: Array<unknown>;
  action: [ConfigComponent] | [];
  // textModifier: [CompiledTextModifier] | [];
  actionTextModifier: [CompiledTextModifier] | [];
};

export default function styles({
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

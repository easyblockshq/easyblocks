import {
  CompiledTextModifier,
  ConfigComponent,
  NoCodeComponentStylesFunctionInput,
} from "@easyblocks/core";
import { box } from "../../../box";
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
}) {
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
    Link: box(
      {
        pointerEvents: "auto",
        ...modifierStyles,
      },
      isEditing ? "span" : "a"
    ),
    ...contextProps,
  };
}

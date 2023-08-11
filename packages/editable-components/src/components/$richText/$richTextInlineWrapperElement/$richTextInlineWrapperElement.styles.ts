import { CompiledTextModifier, ConfigComponent } from "@easyblocks/core";
import { box } from "../../../box";
import { getTextModifierStyles } from "../../../getTextModifierStyles";
import { CompiledComponentStylesToolkit } from "../../../types";

type RichTextActionElementStateAndProps = {
  elements: Array<unknown>;
  action: [ConfigComponent] | [];
  // textModifier: [CompiledTextModifier] | [];
  actionTextModifier: [CompiledTextModifier] | [];
};

export default function styles(
  {
    action,
    elements,
    // textModifier,
    actionTextModifier,
  }: RichTextActionElementStateAndProps,
  t: CompiledComponentStylesToolkit
) {
  const actionStyles =
    action.length > 0
      ? {
          __action: "action",
          background: "transparent",
        }
      : {};

  const { modifierStyles, childStyles } = getTextModifierStyles(
    actionTextModifier,
    t.compilationContext
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
        ...actionStyles,
        ...modifierStyles,
      },
      t.compilationContext.isEditing ? "span" : "a"
    ),
    ...contextProps,
  };
}

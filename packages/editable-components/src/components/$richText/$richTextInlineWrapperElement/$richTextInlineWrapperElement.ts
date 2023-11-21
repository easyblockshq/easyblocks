import {
  EditableComponentToComponentConfig,
  InternalRenderableComponentDefinition,
  textModifierSchemaProp,
} from "@easyblocks/app-utils";
import {
  CompiledComponentConfigBase,
  ComponentSchemaProp,
  ConfigComponent,
  NoCodeComponentStylesFunction,
} from "@easyblocks/core";
import {
  RichTextPartCompiledComponentConfig,
  RichTextPartComponentConfig,
} from "../$richTextPart/$richTextPart";
import richTextInlineWrapperElementStyles, {
  RichTextActionElementValues,
} from "./$richTextInlineWrapperElement.styles";
import { richTextInlineWrapperActionSchemaProp } from "./richTextInlineWrapperActionSchemaProp";

export const optionalTextModifierSchemaProp = textModifierSchemaProp({
  prop: "textModifier",
  label: "Text modifier",
  group: "Text",
  visible: ({
    actionTextModifier,
  }: RichTextInlineWrapperElementEditableComponentConfig) =>
    actionTextModifier.length === 0,
});

const requiredActionTextModifierSchemaProp: ComponentSchemaProp = {
  ...optionalTextModifierSchemaProp,
  prop: "actionTextModifier",
  accepts: ["actionTextModifier"],
  required: true,
  label: "Link styles",
  group: "Action",
  visible: ({ action }: RichTextInlineWrapperElementEditableComponentConfig) =>
    action.length === 1,
};

const richTextInlineWrapperElementEditableComponent: InternalRenderableComponentDefinition<
  "$richTextInlineWrapperElement",
  RichTextActionElementValues
> = {
  id: "$richTextInlineWrapperElement",
  schema: [
    {
      prop: "elements",
      type: "component-collection",
      accepts: ["$richTextPart"],
    },
    // optionalTextModifierSchemaProp,
    richTextInlineWrapperActionSchemaProp,
    requiredActionTextModifierSchemaProp,
  ],
  styles:
    richTextInlineWrapperElementStyles as NoCodeComponentStylesFunction<RichTextActionElementValues>,
};

type RichTextInlineWrapperElementEditableComponentConfig =
  EditableComponentToComponentConfig<
    typeof richTextInlineWrapperElementEditableComponent
  > & {
    action: [ConfigComponent] | [];
    elements: Array<RichTextPartComponentConfig>;
    textModifier: [] | [ConfigComponent];
    actionTextModifier: [] | [ConfigComponent];
  };

type RichTextInlineWrapperElementCompiledComponentConfig =
  CompiledComponentConfigBase<
    RichTextInlineWrapperElementEditableComponentConfig["_template"]
  > & {
    styled: NonNullable<
      ReturnType<typeof richTextInlineWrapperElementStyles>["styled"]
    >;
  } & {
    components: {
      elements: Array<RichTextPartCompiledComponentConfig>;
    };
  };

export { richTextInlineWrapperElementEditableComponent };
export type {
  RichTextInlineWrapperElementEditableComponentConfig,
  RichTextInlineWrapperElementCompiledComponentConfig,
};

import {
  EditableComponentToComponentConfig,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";
import { CompiledComponentConfigBase } from "@easyblocks/core";
import {
  richTextInlineWrapperElementEditableComponent,
  RichTextInlineWrapperElementEditableComponentConfig,
} from "../$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import {
  RichTextPartCompiledComponentConfig,
  RichTextPartComponentConfig,
  richTextPartEditableComponent,
} from "../$richTextPart/$richTextPart";
import richTextLineElementStyles from "./$richTextLineElement.styles";

const richTextLineElementEditableComponent: InternalRenderableComponentDefinition<"$richTextLineElement"> =
  {
    id: "$richTextLineElement",
    schema: [
      {
        prop: "elements",
        type: "component-collection",
        accepts: [
          richTextPartEditableComponent.id,
          richTextInlineWrapperElementEditableComponent.id,
        ],
      },
    ],
    styles: richTextLineElementStyles,
  };

type RichTextLineElementComponentConfig = EditableComponentToComponentConfig<
  typeof richTextLineElementEditableComponent
> & {
  elements: Array<
    | RichTextPartComponentConfig
    | RichTextInlineWrapperElementEditableComponentConfig
  >;
};

type RichTextLineElementCompiledComponentConfig = CompiledComponentConfigBase<
  RichTextLineElementComponentConfig["_template"]
> & {
  styled: Omit<ReturnType<typeof richTextLineElementStyles>, "__props">;
} & {
  components: {
    elements: Array<
      | RichTextPartCompiledComponentConfig
      | RichTextLineElementCompiledComponentConfig
    >;
  };
};

export { richTextLineElementEditableComponent };
export type {
  RichTextLineElementComponentConfig,
  RichTextLineElementCompiledComponentConfig,
};

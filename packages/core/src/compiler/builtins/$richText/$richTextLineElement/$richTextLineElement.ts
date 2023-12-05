import {
  RichTextInlineWrapperElementEditableComponentConfig,
  richTextInlineWrapperElementEditableComponent,
} from "../$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import {
  RichTextPartCompiledComponentConfig,
  RichTextPartComponentConfig,
  richTextPartEditableComponent,
} from "../$richTextPart/$richTextPart";
import {
  CompiledComponentConfigBase,
  NoCodeComponentDefinition,
} from "../../../../types";
import { EditableComponentToComponentConfig } from "../../../types";
import richTextLineElementStyles, {
  RichTextLineCompiledComponentValues,
  RichTextLineParams,
} from "./$richTextLineElement.styles";

const richTextLineElementEditableComponent: NoCodeComponentDefinition<
  RichTextLineCompiledComponentValues,
  RichTextLineParams
> = {
  id: "@easyblocks/rich-text-line-element",
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
  styled: NonNullable<ReturnType<typeof richTextLineElementStyles>["styled"]>;
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
  RichTextLineElementCompiledComponentConfig,
  RichTextLineElementComponentConfig,
};

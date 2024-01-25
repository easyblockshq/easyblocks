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
import {
  RichTextLineCompiledComponentValues,
  RichTextLineParams,
  richTextLineElementStyles,
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
      accepts: [richTextPartEditableComponent.id],
    },
  ],
  styles: richTextLineElementStyles,
};

type RichTextLineElementComponentConfig = EditableComponentToComponentConfig<
  typeof richTextLineElementEditableComponent
> & {
  elements: Array<RichTextPartComponentConfig>;
};

type RichTextLineElementCompiledComponentConfig = CompiledComponentConfigBase<
  RichTextLineElementComponentConfig["_component"]
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

import { CompiledComponentConfigBase, Option } from "@easyblocks/core";
import type {
  EditableComponentToComponentConfig,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";
import {
  RichTextLineElementCompiledComponentConfig,
  RichTextLineElementComponentConfig,
  richTextLineElementEditableComponent,
} from "../$richTextLineElement/$richTextLineElement";
import richTextBlockElementStyles from "./$richTextBlockElement.styles";

type RichTextBlockElementType = "bulleted-list" | "numbered-list" | "paragraph";

const RICH_TEXT_BLOCK_ELEMENT_TYPES: Array<RichTextBlockElementType> = [
  "bulleted-list",
  "numbered-list",
  "paragraph",
];

const RICH_TEXT_BLOCK_ELEMENT_TYPE_OPTIONS: Array<Option> = [
  {
    value: RICH_TEXT_BLOCK_ELEMENT_TYPES[0],
    label: "Bulleted",
  },
  {
    value: RICH_TEXT_BLOCK_ELEMENT_TYPES[1],
    label: "Numbered",
  },
  {
    value: RICH_TEXT_BLOCK_ELEMENT_TYPES[2],
    label: "No list",
  },
];

const richTextBlockElementEditableComponent: InternalRenderableComponentDefinition<"$richTextBlockElement"> =
  {
    id: "$richTextBlockElement",
    schema: [
      {
        prop: "type",
        type: "select",
        params: {
          options: RICH_TEXT_BLOCK_ELEMENT_TYPE_OPTIONS,
        },
        defaultValue: RICH_TEXT_BLOCK_ELEMENT_TYPES[2],
        label: "Type",
        group: "Text",
      },
      {
        prop: "elements",
        type: "component-collection",
        accepts: [richTextLineElementEditableComponent.id],
      },
    ],
    styles: richTextBlockElementStyles,
  };

type RichTextBlockElementComponentConfig = EditableComponentToComponentConfig<
  typeof richTextBlockElementEditableComponent
> & {
  type: RichTextBlockElementType;
  elements: Array<RichTextLineElementComponentConfig>;
};

type RichTextBlockElementCompiledComponentConfig = CompiledComponentConfigBase<
  RichTextBlockElementComponentConfig["_template"],
  { type: RichTextBlockElementType }
> & {
  styled: Omit<ReturnType<typeof richTextBlockElementStyles>, "__props">;
} & {
  components: {
    elements: Array<RichTextLineElementCompiledComponentConfig>;
  };
};

export {
  richTextBlockElementEditableComponent,
  RICH_TEXT_BLOCK_ELEMENT_TYPES,
  RICH_TEXT_BLOCK_ELEMENT_TYPE_OPTIONS,
};
export type {
  RichTextBlockElementComponentConfig,
  RichTextBlockElementCompiledComponentConfig,
  RichTextBlockElementType,
};

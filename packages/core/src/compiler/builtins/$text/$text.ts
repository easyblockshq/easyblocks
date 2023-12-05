import {
  Color,
  Font,
  NoCodeComponentDefinition,
  RefValue,
  ResponsiveValue,
  UnresolvedResource,
} from "../../../types";
import { range } from "@easyblocks/utils";
import { textStyles } from "./$text.styles";
import { EditableComponentToComponentConfig } from "../../types";

const textEditableComponent: NoCodeComponentDefinition<
  {
    color: string;
    value: string;
    accessibilityRole: string;
    font: Record<string, any>;
  },
  { passedAlign: string }
> = {
  id: "@easyblocks/text",
  label: "Simple Text",
  styles: textStyles,
  type: "item",
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_text.png",
  schema: [
    {
      prop: "value",
      label: "Text",
      type: "text",
    },
    {
      prop: "color",
      label: "Color",
      type: "color",
    },
    {
      prop: "font",
      label: "Font",
      type: "font",
    },
    {
      prop: "accessibilityRole",
      type: "select",
      label: "Role",
      params: {
        options: [
          { value: "p", label: "Paragraph" },
          ...range(1, 6).map((index) => ({
            value: `h${index}`,
            label: `Heading ${index}`,
          })),
        ],
      },
      group: "Accessibility and SEO",
    },
  ],
};

type TextComponentConfig = EditableComponentToComponentConfig<
  typeof textEditableComponent
> & {
  color: ResponsiveValue<RefValue<ResponsiveValue<Color>>>;
  font: ResponsiveValue<RefValue<ResponsiveValue<Font>>>;
  value: UnresolvedResource;
  accessibilityRole: string;
};

export { textEditableComponent };
export type { TextComponentConfig };

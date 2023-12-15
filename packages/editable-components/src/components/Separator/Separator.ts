import { NoCodeComponentDefinition } from "@easyblocks/core";
import $separatorStyles from "./Separator.styles";

const separatorDefinition: NoCodeComponentDefinition<{
  height: string;
  color: string;
}> = {
  id: "$separator",
  type: "item",
  label: "Separator",
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_separator.png",
  styles: $separatorStyles,
  schema: [
    {
      prop: "color",
      type: "color",
      label: "Color",
      defaultValue: {
        ref: "black",
        value: "black",
      },
    },
    {
      prop: "height",
      label: "Stroke width",
      type: "select",
      responsive: true,
      params: {
        options: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
        ],
      },
    },
  ],
};

export { separatorDefinition };

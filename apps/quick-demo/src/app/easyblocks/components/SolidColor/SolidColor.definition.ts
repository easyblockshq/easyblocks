import { NoCodeComponentDefinition, TokenValue } from "@easyblocks/core";
import { solidColorStyles } from "./SolidColor.styles";

const solidColorComponentDefinition: NoCodeComponentDefinition = {
  id: "SolidColor",
  label: "Solid color",
  styles: solidColorStyles,
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_solid_color.png",
  schema: [
    {
      prop: "color",
      label: "Color",
      type: "color",
    },
  ],
  preview({ values }) {
    const colorValue = values.color as TokenValue<string>;

    return {
      thumbnail: {
        type: "color",
        color: colorValue.value,
      },
      description: colorValue.tokenId ?? colorValue.value,
    };
  },
};

export { solidColorComponentDefinition };

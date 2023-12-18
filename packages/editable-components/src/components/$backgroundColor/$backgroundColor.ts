import { RefValue } from "@easyblocks/core";
import type { InternalRenderableComponentDefinition } from "@easyblocks/core/_internals";
import { backgroundColorStyles } from "./$backgroundColor.styles";

const backgroundColorComponentDefinition: InternalRenderableComponentDefinition<"$backgroundColor"> =
  {
    id: "$backgroundColor",
    label: "Solid color",
    styles: backgroundColorStyles,
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
      const colorValue = values.color as RefValue<string>;

      return {
        thumbnail: {
          type: "color",
          color: colorValue.value,
        },
        description: colorValue.ref ?? colorValue.value,
      };
    },
  };

export { backgroundColorComponentDefinition };

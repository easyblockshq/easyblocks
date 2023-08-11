import {
  InternalRenderableComponentDefinition,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import { Color, RefValue } from "@easyblocks/core";
import { backgroundColorStyles } from "./$backgroundColor.styles";

const backgroundColorComponentDefinition: InternalRenderableComponentDefinition<"$backgroundColor"> =
  {
    id: "$backgroundColor",
    label: "Color",
    tags: ["image", "notrace"],
    styles: backgroundColorStyles,
    schema: [
      {
        prop: "color",
        label: "Color",
        type: "color",
      },
    ],
    getEditorSidebarPreview: (config, { breakpointIndex }) => {
      const activeColorValue: RefValue<Color> = responsiveValueForceGet(
        config.color,
        breakpointIndex
      );

      if (!activeColorValue) {
        return;
      }

      return {
        type: "solid",
        color: activeColorValue.value,
        description: activeColorValue.ref ?? activeColorValue.value,
      };
    },
  };

export { backgroundColorComponentDefinition };

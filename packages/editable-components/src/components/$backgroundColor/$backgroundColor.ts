import {
  InternalRenderableComponentDefinition,
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import { Color, RefValue } from "@easyblocks/core";
import { backgroundColorStyles } from "./$backgroundColor.styles";

const backgroundColorComponentDefinition: InternalRenderableComponentDefinition<"$backgroundColor"> =
  {
    id: "$backgroundColor",
    label: "Solid color",
    styles: backgroundColorStyles,
    schema: [
      {
        prop: "color",
        label: "Color",
        type: "color",
      },
    ],
    getEditorSidebarPreview: (config, _, { breakpointIndex, devices }) => {
      const device = responsiveValueFindDeviceWithDefinedValue(
        config.color,
        breakpointIndex,
        devices
      );

      if (!device) {
        return {
          description: "None",
        };
      }

      const activeColorValue: RefValue<Color> = responsiveValueForceGet(
        config.color,
        device.id
      );

      if (!activeColorValue) {
        return;
      }

      return {
        thumbnail: {
          type: "color",
          color: activeColorValue.value,
        },
        description: activeColorValue.ref ?? activeColorValue.value,
      };
    },
  };

export { backgroundColorComponentDefinition };

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
    getEditorSidebarPreview: (config, _, { breakpointIndex, devices }) => {
      const device = responsiveValueFindDeviceWithDefinedValue(
        config.color,
        breakpointIndex,
        devices
      );

      if (!device) {
        return {
          type: "icon",
          icon: "link",
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
        type: "solid",
        color: activeColorValue.value,
        description: activeColorValue.ref ?? activeColorValue.value,
      };
    },
  };

export { backgroundColorComponentDefinition };

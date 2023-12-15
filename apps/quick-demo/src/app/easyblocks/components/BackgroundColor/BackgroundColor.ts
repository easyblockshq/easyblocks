import {
  Color,
  NoCodeComponentDefinition,
  RefValue,
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueForceGet,
} from "@easyblocks/core";
import { backgroundColorStyles } from "./BackgroundColor.styles";

const backgroundColorComponentDefinition: NoCodeComponentDefinition = {
  id: "BackgroundColor",
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

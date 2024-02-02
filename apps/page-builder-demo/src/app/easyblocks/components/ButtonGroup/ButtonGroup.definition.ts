import { NoCodeComponentDefinition } from "@easyblocks/core";
import { buttonGroupStyles } from "./ButtonGroup.styles";

export const buttonGroupDefinition: NoCodeComponentDefinition = {
  id: "ButtonGroup",
  label: "Button Group",
  type: "item",
  pasteSlots: ["Buttons"],
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button_group.png",
  styles: buttonGroupStyles,
  editing: ({ values }) => {
    return {
      components: {
        Buttons: values.Buttons.map(() => ({
          direction: "horizontal",
        })),
      },
    };
  },
  schema: [
    {
      prop: "verticalLayout",
      label: "Vertical layout",
      type: "boolean",
    },
    {
      prop: "gap",
      label: "Gap",
      type: "space",
    },
    {
      prop: "Buttons",
      label: "Buttons",
      type: "component-collection",
      accepts: ["button"],
    },
  ],
};

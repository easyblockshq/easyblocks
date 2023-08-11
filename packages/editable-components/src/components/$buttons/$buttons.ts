import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { buttonsStyles } from "./$buttons.styles";

const buttonsComponentDefinition: InternalRenderableComponentDefinition<"$buttons"> =
  {
    id: "$buttons",
    tags: ["item", "notrace"],
    pasteSlots: ["Buttons"],
    styles: buttonsStyles,
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
        componentTypes: ["button"],
      },
    ],
  };

export { buttonsComponentDefinition };

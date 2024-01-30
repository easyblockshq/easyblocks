import { NoCodeComponentDefinition } from "@easyblocks/core";

const panelCardDefinition: NoCodeComponentDefinition = {
  id: "PanelCard",
  schema: [
    {
      prop: "HeaderStack",
      type: "component",
      required: true,
      accepts: ["Stack"],
    },
    {
      prop: "Items",
      type: "component-collection",
      accepts: ["item", "PropertiesGroup"],
    },
    {
      prop: "isEditable",
      label: "Show buttons",
      type: "boolean",
    },
    {
      prop: "Buttons",
      type: "component",
      required: true,
      accepts: ["ButtonsGroup"],
    },
  ],
  editing() {
    return {
      components: {
        HeaderStack: {
          selectable: false,
        },
      },
    };
  },
};

export { panelCardDefinition };

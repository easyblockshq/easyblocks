import { NoCodeComponentDefinition } from "@easyblocks/core";

const appShellHeaderDefinition: NoCodeComponentDefinition = {
  id: "AppShellHeader",
  schema: [
    {
      prop: "Items",
      type: "component",
      required: true,
      accepts: ["Stack"],
    },
  ],
  editing() {
    return {
      components: {
        Items: {
          selectable: false,
        },
      },
    };
  },
};

export { appShellHeaderDefinition };

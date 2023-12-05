import { NoCodeComponentDefinition } from "@easyblocks/core";

const rootGridComponentDefinition: NoCodeComponentDefinition = {
  id: "$RootGrid",
  editing: () => {
    return {
      components: {
        data: {
          selectable: false,
        },
      },
    };
  },
  schema: [
    {
      prop: "data",
      label: "data",
      type: "component",
      accepts: ["$Grid"],
      required: true,
    },
  ],
};

export { rootGridComponentDefinition };

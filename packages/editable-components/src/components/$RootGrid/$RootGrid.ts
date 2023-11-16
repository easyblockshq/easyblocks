import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";

const rootGridComponentDefinition: InternalRenderableComponentDefinition<"$RootGrid"> =
  {
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

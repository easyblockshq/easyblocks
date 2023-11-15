import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { rootGridStyles } from "./$RootGrid.styles";

const rootGridComponentDefinition: InternalRenderableComponentDefinition<"$RootGrid"> =
  {
    id: "$RootGrid",
    styles: rootGridStyles,
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

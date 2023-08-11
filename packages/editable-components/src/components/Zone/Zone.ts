import type { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";

const zoneComponentDefinition: InternalRenderableComponentDefinition<"$Zone"> =
  {
    id: "$Zone",
    schema: [
      {
        prop: "blocks",
        type: "component-collection",
        componentTypes: ["section"],
      },
    ],
    styles: () => ({}),
    tags: [],
  };

export { zoneComponentDefinition };

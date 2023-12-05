import type { NoCodeComponentDefinition } from "@easyblocks/core/";

const zoneComponentDefinition: NoCodeComponentDefinition = {
  id: "$Zone",
  schema: [
    {
      prop: "blocks",
      type: "component-collection",
      accepts: ["section"],
    },
  ],
};

export { zoneComponentDefinition };

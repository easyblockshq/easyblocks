import { NoCodeComponentDefinition } from "@easyblocks/core";

const openDialogDefinition: NoCodeComponentDefinition = {
  id: "OpenDialog",
  type: "action",
  schema: [
    {
      prop: "Content",
      type: "component",
      required: true,
      accepts: ["DialogContent"],
    },
  ],
};

export { openDialogDefinition };

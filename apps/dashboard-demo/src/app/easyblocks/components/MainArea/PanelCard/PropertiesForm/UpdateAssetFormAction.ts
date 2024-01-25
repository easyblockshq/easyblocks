import { NoCodeComponentDefinition } from "@easyblocks/core";

const updateAssetFormAction: NoCodeComponentDefinition = {
  id: "UpdateAssetFormAction",
  label: "Update Asset",
  schema: [
    {
      prop: "asset",
      type: "formAction",
    },
  ],
  type: "formAction",
};

export { updateAssetFormAction };

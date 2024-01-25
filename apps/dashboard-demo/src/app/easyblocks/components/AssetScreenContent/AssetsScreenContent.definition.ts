import { createMainAreaBasedDefinition } from "../MainArea/MainArea";

const assetScreenContentDefinition = createMainAreaBasedDefinition({
  id: "AssetScreenContent",
  label: "Asset screen content",
  rootParams: [
    {
      prop: "asset",
      label: "Asset",
      widgets: [
        {
          id: "asset",
          label: "Asset",
        },
      ],
    },
  ],
});

export { assetScreenContentDefinition };

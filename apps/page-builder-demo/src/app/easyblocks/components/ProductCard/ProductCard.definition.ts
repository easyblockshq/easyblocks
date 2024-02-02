import { NoCodeComponentDefinition } from "@easyblocks/core";

/**
 * ProductCard is just for the demo purpose, it's not really styleable
 * It's only to show how external data can be connected to component
 */
export const productCardDefinition: NoCodeComponentDefinition = {
  id: "ProductCard",
  label: "Product Card",
  type: "card",
  allowSave: true,
  schema: [
    {
      prop: "product",
      label: "Product",
      type: "product",
    },
    {
      prop: "relatedProductsMode",
      label: "Related products - mode",
      type: "select",
      params: {
        options: [
          {
            label: "Off",
            value: "disabled",
          },
          {
            label: "On",
            value: "enabled",
          },
          {
            label: "On hover",
            value: "onHover",
          },
        ],
      },
    },
    {
      prop: "withBackdrop",
      label: "Backdrop",
      type: "boolean",
    },
  ],
};

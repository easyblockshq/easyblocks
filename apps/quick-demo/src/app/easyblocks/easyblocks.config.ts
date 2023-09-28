import { Config } from "@easyblocks/core";
import { builtinEditableComponentsDefinitions } from "@easyblocks/editable-components";
import { pexelsImageWidget } from "./resources/pexels";
import { productWidget } from "./resources/product";
import { mockImageWidget } from "./externalData/mockMedia/mockImageWidget";
import { mockVideoWidget } from "@/app/easyblocks/externalData/mockMedia/mockVideoWidget";

if (!process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN");
}

const easyblocksAccessToken = process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN;

export const easyblocksConfig: Config = {
  accessToken: easyblocksAccessToken,
  locales: [
    {
      code: "en-US",
      isDefault: true,
    },
    {
      code: "de-DE",
      fallback: "en-US",
    },
  ],
  rootContainers: {
    content: {
      label: "Content document template",
      defaultConfig: {
        _template: "$RootSections",
        data: [],
      },
    },
    product: {
      label: "Product document template",
      defaultConfig: {
        _template: "$RootSections",
        data: [],
      },
      schema: [
        {
          prop: "product",
          label: "Product",
          type: "resource",
          resourceType: "product",
        },
        {
          prop: "fallbackProduct",
          label: "Fallback product",
          type: "resource",
          resourceType: "product",
        },
      ],
    },
  },
  components: [
    ...builtinEditableComponentsDefinitions,
    {
      id: "ProductCard",
      label: "Product Card",
      tags: ["card"],
      schema: [
        {
          prop: "product",
          label: "Product",
          type: "resource",
          resourceType: "product",
        },
        {
          prop: "relatedProductsMode",
          label: "Related products - mode",
          type: "select",
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
        {
          prop: "withBackdrop",
          label: "Backdrop",
          type: "boolean",
        },
      ],
    },
  ],
  resourceTypes: {
    image: {
      widgets: [mockImageWidget, pexelsImageWidget, productWidget],
    },
    video: {
      widgets: [mockVideoWidget],
    },
    product: {
      widgets: [productWidget],
    },
  },
  disableCustomTemplates: true,
};

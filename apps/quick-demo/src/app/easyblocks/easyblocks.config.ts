import { Config } from "@easyblocks/core";
import { builtinEditableComponentsDefinitions } from "@easyblocks/editable-components";
import { pexelsImageWidget } from "./resources/pexels";
import { productWidget } from "./resources/product";
import { mockImageWidget } from "./externalData/mockMedia/mockImageWidget";
import { mockVideoWidget } from "@/app/easyblocks/externalData/mockMedia/mockVideoWidget";
import { templates } from "@/app/easyblocks/templates/templates";

if (!process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN");
}

const easyblocksAccessToken = process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN;

const MASTER_FONT_FAMILY = "-apple-system, BlinkMacSystemFont, sans-serif";

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
      type: "card",
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
  colors: [
    {
      id: "dark",
      label: "Black",
      value: "black",
    },
    {
      id: "white",
      label: "White",
      value: "white",
    },
    {
      id: "dark-grey",
      label: "Dark Grey",
      value: "#363636",
    },
    {
      id: "light-grey",
      label: "Light Grey",
      value: "#F2F2F2",
    },
    {
      id: "transparent",
      label: "Transparent",
      value: "transparent",
    },
    {
      id: "transparent-grey-dark",
      label: "Transparent Dark",
      value: "#363636",
    },
    {
      id: "transparent-grey-light",
      label: "Transparent Light",
      value: "#36363680",
    },
  ],
  fonts: [
    {
      id: "body",
      label: "Body",
      value: {
        fontFamily: MASTER_FONT_FAMILY,
        fontSize: 20,
        fontWeight: 400,
        lineHeight: 1.2,
        "@xs": {
          fontSize: 18,
        },
      },
    },
    {
      id: "body.bold",
      label: "Body (bold)",
      value: {
        fontFamily: MASTER_FONT_FAMILY,
        fontSize: 20,
        fontWeight: 500,
        lineHeight: 1.2,
        "@xs": {
          fontSize: 18,
        },
      },
    },
    {
      id: "body2",
      label: "Body small",
      value: {
        fontFamily: MASTER_FONT_FAMILY,
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1.2,
      },
    },
    {
      id: "body2.bold",
      label: "Body small (bold)",
      value: {
        fontFamily: MASTER_FONT_FAMILY,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.2,
      },
    },
    {
      id: "heading1",
      label: "Heading 1",
      value: {
        fontFamily: MASTER_FONT_FAMILY,
        fontSize: 64,
        fontWeight: 500,
        lineHeight: 1.2,
        "@xs": {
          fontSize: 36,
        },
      },
    },
    {
      id: "heading2",
      label: "Heading 2",
      value: {
        fontFamily: MASTER_FONT_FAMILY,
        fontSize: 48,
        fontWeight: 500,
        lineHeight: 1.2,
        "@xs": {
          fontSize: 32,
        },
      },
    },
    {
      id: "heading3",
      label: "Heading 3",
      value: {
        fontFamily: MASTER_FONT_FAMILY,
        fontSize: 32,
        fontWeight: 500,
        lineHeight: 1.2,
        "@xs": {
          fontSize: 28,
        },
      },
    },
    {
      id: "heading4",
      label: "Heading 4",
      value: {
        fontFamily: MASTER_FONT_FAMILY,
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1.2,
      },
    },
  ],
  resourceTypes: {
    image: {
      widgets: [mockImageWidget, pexelsImageWidget],
    },
    video: {
      widgets: [mockVideoWidget],
    },
    product: {
      widgets: [productWidget],
    },
  },
  // disableCustomTemplates: true,
  templates,
};

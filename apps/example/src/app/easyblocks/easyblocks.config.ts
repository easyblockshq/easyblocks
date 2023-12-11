import { Config } from "@easyblocks/core";
import { builtinEditableComponentsDefinitions } from "@easyblocks/editable-components";
import {
  easyblocksImageWidget,
  easyblocksVideoWidget,
} from "@easyblocks/media";
import { pexelsImageWidget } from "./resources/pexels";
import { productWidget } from "./resources/product";

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
  documentTypes: {
    content: {
      label: "Content document template",
      defaultEntry: {
        _template: "$RootSections",
        data: [],
      },
    },
    product: {
      label: "Product document template",
      defaultEntry: {
        _template: "$RootSections",
        data: [],
      },
      schema: [
        {
          prop: "product",
          label: "Product",
          type: "product",
        },
        {
          prop: "fallbackProduct",
          label: "Fallback product",
          type: "product",
        },
      ],
    },
  },
  components: builtinEditableComponentsDefinitions,
  types: {
    image: {
      widgets: [easyblocksImageWidget, pexelsImageWidget, productWidget],
    },
    video: {
      widgets: [easyblocksVideoWidget],
    },
    product: {
      widgets: [productWidget],
    },
    text: {
      widgets: [productWidget],
    },
  },
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
      value: "#36363680",
    },
    {
      id: "transparent-grey-light",
      label: "Transparent Light",
      value: "#D8D8D880",
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
  icons: [
    {
      id: "arrowLeft",
      label: "Arrow left",
      value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="100px" height="100px"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`,
    },
    {
      id: "arrowRight",
      label: "Arrow right",
      value: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>`,
    },
    {
      id: "play",
      label: "Play",
      value: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>`,
    },
    {
      id: "pause",
      label: "Pause",
      value: `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>`,
    },
    {
      id: "mute",
      label: "Mute",
      value: `<svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
</svg>`,
    },
    {
      id: "unmute",
      label: "Unmute",
      value: `<svg viewBox="0 0 24 24">
    <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
</svg>`,
    },
    {
      id: "heart",
      label: "Heart",
      value: `<svg viewBox="0 -960 960 960"><path fill="currentColor" d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>`,
    },
  ],
  aspectRatios: [
    {
      id: "panoramic",
      label: "Panoramic (2:1)",
      value: "2:1",
    },
    {
      id: "landscape",
      label: "Landscape (16:9)",
      value: "16:9",
    },
    {
      id: "portrait",
      label: "Portrait (4:5)",
      value: "4:5",
    },
    {
      id: "square",
      label: "Square (1:1)",
      value: "1:1",
    },
    {
      id: "panoramic",
      label: "Panoramic (2:1)",
      value: "2:1",
    },
  ],
  boxShadows: [
    {
      id: "sm",
      label: "sm",
      value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    },
    {
      id: "md",
      label: "md",
      value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    },
    {
      id: "lg",
      label: "lg",
      value:
        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    },
    {
      id: "xl",
      label: "xl",
      value:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
    {
      id: "2xl",
      label: "2xl",
      value: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
  ],
  space: [
    {
      id: "containerMargin.default",
      value: "5vw",
    },
    {
      id: "containerMargin.large",
      value: "10vw",
    },
  ],
};

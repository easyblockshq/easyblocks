import { alertActionDefinition } from "@/app/easyblocks/components/AlertAction/AlertAction.definition";
import { bannerCardDefinition } from "@/app/easyblocks/components/BannerCard/BannerCard.definition";
import { coverCardDefinition } from "@/app/easyblocks/components/BannerCard/CoverCard/CoverCard.definition";
import { bannerSectionDefinition } from "@/app/easyblocks/components/BannerSection/BannerSection.definition";
import { linkDefinition } from "@/app/easyblocks/components/Link/Link.definition";
import { productCardDefinition } from "@/app/easyblocks/components/ProductCard/ProductCard.definition";
import { vimeoPlayerEditableComponent } from "@/app/easyblocks/components/VimeoPlayer/VimeoPlayer.definition";
import { mockVideoWidget } from "@/app/easyblocks/externalData/mockMedia/mockVideoWidget";
import { Config, EasyblocksBackend } from "@easyblocks/core";
import { buttonComponentDefinition } from "./components/Button/Button.definition";
import { buttonGroupDefinition } from "./components/ButtonGroup/ButtonGroup.definition";
import { gridComponentDefinition } from "./components/Grid/Grid.definition";
import { imageComponentDefinition } from "./components/Image/Image.definition";
import {
  productPageDefinition,
  standardPageDefinition,
} from "./components/RootSectionStack/RootSectionStack.definition";
import { solidColorComponentDefinition } from "./components/SolidColor/SolidColor.definition";
import { stackComponentDefinition } from "./components/Stack/Stack.definition";
import { textLinkDefinition } from "./components/TextLink/TextLink.definition";
import { twoCardsComponentDefinition } from "./components/TwoCards/TwoCards.definition";
import { videoComponentDefinition } from "./components/Video/Video.definition";
import { mockImageWidget } from "./externalData/mockMedia/mockImageWidget";
import { pexelsImageWidget } from "./externalData/pexels/pexelsImageWidget";
import { productWidget } from "./externalData/product/productWidget";
import { templates } from "./templates/templates";
import { simpleBannerDefinition } from "./components/SimpleBanner/SimpleBanner.definition";

if (!process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN");
}

export const easyblocksConfig: Config = {
  backend: new EasyblocksBackend({
    accessToken: process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN,
  }),
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
  components: [
    bannerSectionDefinition,
    bannerCardDefinition,
    productPageDefinition,
    standardPageDefinition,
    gridComponentDefinition,
    buttonGroupDefinition,
    imageComponentDefinition,
    videoComponentDefinition,
    stackComponentDefinition,
    twoCardsComponentDefinition,
    solidColorComponentDefinition,
    buttonComponentDefinition,
    coverCardDefinition,
    vimeoPlayerEditableComponent,
    productCardDefinition,
    linkDefinition,
    alertActionDefinition,
    textLinkDefinition,
    simpleBannerDefinition,
  ],
  types: {
    "@easyblocks/image": {
      type: "external",
      widgets: [mockImageWidget, pexelsImageWidget],
    },
    "@easyblocks/video": {
      type: "external",
      widgets: [mockVideoWidget],
    },
    product: {
      type: "external",
      widgets: [productWidget],
    },
    url: {
      type: "inline",
      widget: {
        id: "url",
        label: "URL",
      },
      defaultValue: "https://google.com",
      validate(value) {
        return (
          typeof value === "string" &&
          (value.startsWith("http://") || value.startsWith("https://"))
        );
      },
    },
    containerWidth: {
      type: "token",
      responsiveness: "always",
      token: "containerWidths",
      defaultValue: { tokenId: "none" },
    },
  },
  hideCloseButton: true,
  tokens: {
    colors: [
      {
        id: "grey_05",
        label: "Dark",
        value: "#252525",
        isDefault: true,
      },
      {
        id: "grey_01",
        label: "Light",
        value: "#f9f8f3",
      },
      {
        id: "beige_01",
        label: "Beige",
        value: "#f1f0ea",
      },
      {
        id: "yellow",
        label: "Lemonade Yellow",
        value: "#FCF0C5",
      },
      {
        id: "golden-yellow",
        label: "Golden Yellow",
        value: "#FCF0C5",
      },
      {
        id: "lavender",
        label: "Lavender",
        value: "#E1E2ED",
      },
      {
        id: "olive",
        label: "Olive",
        value: "#A9A886",
      },
      {
        id: "green",
        label: "Mint",
        value: "#ACC3AD",
      },
      {
        id: "emerald",
        label: "Emerald",
        value: "#8BC6AD",
      },
      {
        id: "dusty-rose",
        label: "Dusty Rose",
        value: "#DBBDD1",
      },
      {
        id: "terracotta",
        label: "Terracotta",
        value: "#823735",
      },
      {
        id: "sky-blue",
        label: "Sky Blue",
        value: "#7DABDA",
      },
      {
        id: "dark-blue",
        label: "Dark Blue",
        value: "#31426A",
      },
      {
        id: "olive",
        label: "Olive",
        value: "#A9A886",
      },
      {
        id: "dusty-blue",
        label: "Dusty Blue",
        value: "#ACB4BA",
      },
      {
        id: "blush",
        label: "Blush",
        value: "#ECDBCF",
      },

      {
        id: "grey_02",
        label: "Grey 2",
        value: "#bdbdbd",
      },
      {
        id: "grey_03",
        label: "Grey 3",
        value: "#a0a09d",
      },
      {
        id: "grey_04",
        label: "Grey 4",
        value: "#4F4F4F",
      },
      {
        id: "black",
        label: "Black",
        value: "#000000",
      },
      {
        id: "white",
        label: "White",
        value: "#ffffff",
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
          fontSize: 20,
          lineHeight: 1.8,
          fontFamily: "test-soehne-mono",
        },
        isDefault: true,
      },
      {
        id: "body2",
        label: "Body small",
        value: {
          fontSize: 13,
          lineHeight: 1.8,
          fontFamily: "test-soehne-mono",
        },
      },
      {
        id: "heading1",
        label: "Heading 1",
        value: {
          $res: true,
          sm: {
            fontSize: 36,
            fontFamily: "test-national-2",
            lineHeight: 1.2,
            fontWeight: 700,
          },
          md: {
            fontSize: 48,
            fontFamily: "test-national-2",
            lineHeight: 1.2,
            fontWeight: 700,
          },
        },
      },
      {
        id: "heading2",
        label: "Heading 2",
        value: {
          $res: true,
          sm: {
            fontFamily: "test-national-2",
            fontSize: 24,
            lineHeight: 1.2,
            fontWeight: 700,
          },
          md: {
            fontFamily: "test-national-2",
            fontSize: 36,
            lineHeight: 1.2,
            fontWeight: 700,
          },
        },
      },
      {
        id: "heading3",
        label: "Heading 3",
        value: {
          fontFamily: "test-national-2",
          fontSize: 21,
          lineHeight: 1.4,
          fontWeight: 600,
        },
      },
      {
        id: "heading4",
        label: "Heading 4",
        value: {
          fontFamily: "test-national-2",
          fontSize: 16,
          lineHeight: 1.4,
          fontWeight: 600,
        },
      },
      {
        id: "heading5",
        label: "Heading 5",
        value: {
          fontFamily: "test-national-2",
          fontSize: 13,
          lineHeight: 1.4,
          fontWeight: 600,
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
        isDefault: true,
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
    ],
    boxShadows: [
      {
        id: "none",
        label: "None",
        value: "none",
        isDefault: true,
      },
      {
        id: "sm",
        label: "sm",
        value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      {
        id: "md",
        label: "md",
        value:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
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
    containerWidths: [
      {
        id: "none",
        label: "None",
        value: -1,
        isDefault: true,
      },
      {
        id: "lg",
        label: "Large",
        value: 1280,
      },
      {
        id: "md",
        label: "Medium",
        value: 1024,
      },
      {
        id: "sm",
        label: "Small",
        value: 768,
      },
    ],
    space: [
      {
        id: "0",
        label: "0",
        value: "0px",
        isDefault: true,
      },
      {
        id: "1",
        label: "1",
        value: "1px",
      },
      {
        id: "2",
        label: "2",
        value: "2px",
      },
      {
        id: "4",
        label: "4",
        value: "4px",
      },
      {
        id: "6",
        label: "6",
        value: "6px",
      },
      {
        id: "8",
        label: "8",
        value: "8px",
      },
      {
        id: "12",
        label: "12",
        value: "12px",
      },
      {
        id: "16",
        label: "16",
        value: "16px",
      },
      {
        id: "24",
        label: "24",
        value: "24px",
      },
      {
        id: "32",
        label: "32",
        value: "32px",
      },
      {
        id: "48",
        label: "48",
        value: "48px",
      },
      {
        id: "64",
        label: "64",
        value: "64px",
      },
      {
        id: "96",
        label: "96",
        value: "96px",
      },
      {
        id: "128",
        label: "128",
        value: "128px",
      },
      {
        id: "160",
        label: "160",
        value: "160px",
      },
      {
        id: "containerMargin.standard",
        label: "Standard",
        value: {
          $res: true,
          md: "5vw",
          lg: "8vw",
        },
        isDefault: true,
      },
      {
        id: "containerMargin.large",
        label: "Large",
        value: {
          $res: true,
          xs: "5vw",
          md: "8vw",
          lg: "12vw",
        },
      },
    ],
  },
  templates,
};

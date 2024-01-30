import { NoomaBannerSection1 } from "@/app/easyblocks/templates/nooma/BannerSection1/NoomaBannerSection1";
import { NoomaBannerSection2 } from "@/app/easyblocks/templates/nooma/BannerSection2/NoomaBannerSection2";
import { NoomaBannerSection3 } from "@/app/easyblocks/templates/nooma/BannerSection3/NoomaBannerSection3";
import { NoomaBannerSection4 } from "@/app/easyblocks/templates/nooma/BannerSection4/NoomaBannerSection4";
import { NoomaBannerSection5 } from "@/app/easyblocks/templates/nooma/BannerSection5/NoomaBannerSection5";
import { NoomaBasicCard1 } from "@/app/easyblocks/templates/nooma/BasicCard1/NoomaBasicCard1";
import { NoomaBasicCard2 } from "@/app/easyblocks/templates/nooma/BasicCard2/NoomaBasicCard2";
import { NoomaBasicCard3 } from "@/app/easyblocks/templates/nooma/BasicCard3/NoomaBasicCard3";
import { NoomaBasicCard4 } from "@/app/easyblocks/templates/nooma/BasicCard4/NoomaBasicCard4";
import { NoomaBasicCard5 } from "@/app/easyblocks/templates/nooma/BasicCard5/NoomaBasicCard5";
import { NoomaGrid1 } from "@/app/easyblocks/templates/nooma/Grid1/NoomaGrid1";
import { NoomaGrid2 } from "@/app/easyblocks/templates/nooma/Grid2/NoomaGrid2";
import { NoomaGrid3 } from "@/app/easyblocks/templates/nooma/Grid3/NoomaGrid3";
import { NoomaGrid4 } from "@/app/easyblocks/templates/nooma/Grid4/NoomaGrid4";
import { NoomaGrid5 } from "@/app/easyblocks/templates/nooma/Grid5/NoomaGrid5";
import { NoomaProductCard1 } from "@/app/easyblocks/templates/nooma/ProductCard1/NoomaProductCard1";
import { NoomaSlider1 } from "@/app/easyblocks/templates/nooma/Slider1/NoomaSlider1";
import { NoomaSlider2 } from "@/app/easyblocks/templates/nooma/Slider2/NoomaSlider2";
import { NoomaTwoCards1 } from "@/app/easyblocks/templates/nooma/TwoCards1/NoomaTwoCards1";
import { NoomaTwoCards2 } from "@/app/easyblocks/templates/nooma/TwoCards2/NoomaTwoCards2";
import { NoomaTwoCards3 } from "@/app/easyblocks/templates/nooma/TwoCards3/NoomaTwoCards3";
import { NoomaTwoCards4 } from "@/app/easyblocks/templates/nooma/TwoCards4/NoomaTwoCards4";
import { Template } from "@easyblocks/core";
import BannerSection2_empty from "./basic/BannerSection2_empty.json";
import BasicCard_empty from "./basic/BasicCard_empty.json";
import Button_icon_standard from "./basic/Button_icon_standard.json";
import Button_standard from "./basic/Button_standard.json";
import Button_standard_light from "./basic/Button_standard_light.json";
import Button_text from "./basic/Button_text.json";
import Grid_empty from "./basic/Grid_empty.json";
import Slider_empty from "./basic/Slider_empty.json";
import TwoCards_empty from "./basic/TwoCards_empty.json";
import Video from "./basic/video.json";
import StarterTemplate from "./starterTemplate.json";

export const templates: Template[] = [
  {
    id: "BannerSection2_Empty",
    entry: BannerSection2_empty,
    thumbnailLabel: "Empty Hero Banner",
  },
  NoomaBannerSection4,
  NoomaBannerSection1,
  NoomaBannerSection2,
  NoomaBannerSection3,
  NoomaBannerSection5,

  {
    id: "Slider_empty",
    entry: Slider_empty,
    thumbnailLabel: "Empty Slider",
  },
  {
    id: "Grid_empty",
    entry: Grid_empty,
    thumbnailLabel: "Empty Grid",
  },
  NoomaGrid1,
  NoomaGrid2,
  NoomaGrid3,
  NoomaGrid4,
  NoomaGrid5,
  NoomaSlider1,
  NoomaSlider2,

  {
    id: "TwoCards_Empty",
    entry: TwoCards_empty,
    thumbnailLabel: "Empty Two Cards",
  },
  NoomaTwoCards1,
  NoomaTwoCards2,
  NoomaTwoCards3,
  NoomaTwoCards4,

  {
    id: "BasicCard_Empty",
    entry: BasicCard_empty,
    thumbnailLabel: "Empty Basic Card",
  },
  NoomaBasicCard1,
  NoomaBasicCard2,
  NoomaBasicCard3,
  NoomaBasicCard4,
  NoomaBasicCard5,

  NoomaProductCard1,

  {
    id: "ButtonGroup_default",
    label: "Default",
    entry: {
      _id: "",
      _component: "ButtonGroup",
      gap: {
        $res: true,
        xl: {
          tokenId: "12",
          value: "12px",
          widgetId: "@easyblocks/space",
        },
      },
    },
  },
  {
    id: "Video_default",
    label: "Default",
    entry: Video,
  },
  {
    id: "Button_standard",
    label: "Standard",
    thumbnail:
      "https://images.ctfassets.net/blh4anz05qu1/1LdC2xsiaoytmv2PgAnQQD/379daa392c46ff7a33761fb6f0a7d889/Screenshot_2023-10-06_at_13.59.15.png",
    entry: Button_standard,
  },
  {
    id: "Button_standard_light",
    label: "Standard light",
    thumbnail:
      "https://images.ctfassets.net/blh4anz05qu1/5ZjWVxfWfAPLYivhp1nlUQ/360d5cb90b75cd51ad099447b2e4a5b1/Screenshot_2023-10-16_at_16.27.32.png",
    entry: Button_standard_light,
  },
  {
    id: "Button_text",
    label: "Text",
    thumbnail:
      "https://images.ctfassets.net/blh4anz05qu1/7t6QX8UnUDcwvbVRvJrW5Z/6ce07aa0d99eee0977fb447e8a39810e/Screenshot_2023-10-16_at_16.28.54.png",
    entry: Button_text,
  },
  {
    id: "Button_icon",
    label: "Icon standard",
    thumbnail:
      "https://images.ctfassets.net/blh4anz05qu1/5qsvp8xUQZjayKaj5XNmil/84f6f90a3c5779390e9eaabce5a3e1d3/Screenshot_2023-10-06_at_14.03.11.png",
    entry: Button_icon_standard,
  },
  {
    id: "StarterTemplate",
    entry: StarterTemplate,
  },
];

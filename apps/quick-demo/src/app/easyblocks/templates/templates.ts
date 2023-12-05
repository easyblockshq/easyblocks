import BannerSection2_1 from "./basic/BannerSection2_1.json";
import BannerSection2_2 from "./basic/BannerSection2_2.json";
import BannerSection2_3 from "./basic/BannerSection2_3.json";
import BannerSection2_4 from "./basic/BannerSection2_4.json";
import BannerSection2_empty from "./basic/BannerSection2_empty.json";
import Grid_1 from "./basic/Grid_1.json";
import Grid_2 from "./basic/Grid_2.json";
import Grid_3 from "./basic/Grid_3.json";
import Grid_empty from "./basic/Grid_empty.json";
import Slider_1 from "./basic/Slider_1.json";
import Slider_empty from "./basic/Slider_empty.json";
import TwoCards_1 from "./basic/TwoCards_1.json";
import TwoCards_2 from "./basic/TwoCards_2.json";
import TwoCards_3 from "./basic/TwoCards_3.json";
import TwoCards_4 from "./basic/TwoCards_4.json";
import TwoCards_empty from "./basic/TwoCards_empty.json";
import BasicCard_empty from "./basic/BasicCard_empty.json";
import BasicCard_1 from "./basic/BasicCard_1.json";
import BasicCard_2 from "./basic/BasicCard_2.json";
import BasicCard_3 from "./basic/BasicCard_3.json";
import BasicCard_4 from "./basic/BasicCard_4.json";
import BasicCard_5 from "./basic/BasicCard_5.json";
import BasicCard_6 from "./basic/BasicCard_6.json";
import BasicCard_7 from "./basic/BasicCard_7.json";
import video from "./basic/video.json";
import Button_standard from "./basic/Button_standard.json";
import Button_standard_light from "./basic/Button_standard_light.json";
import Button_text from "./basic/Button_text.json";
import Button_icon_standard from "./basic/Button_icon_standard.json";

import { Template } from "@easyblocks/core";
import { buildRichTextNoCodeEntry } from "@easyblocks/core/_internals";

import { NoomaBannerSection1 } from "@/app/easyblocks/templates/nooma/BannerSection1/NoomaBannerSection1";
import { NoomaBannerSection2 } from "@/app/easyblocks/templates/nooma/BannerSection2/NoomaBannerSection2";
import { NoomaBannerSection3 } from "@/app/easyblocks/templates/nooma/BannerSection3/NoomaBannerSection3";
import { NoomaBannerSection4 } from "@/app/easyblocks/templates/nooma/BannerSection4/NoomaBannerSection4";
import { NoomaBannerSection5 } from "@/app/easyblocks/templates/nooma/BannerSection5/NoomaBannerSection5";
import { NoomaTwoCards1 } from "@/app/easyblocks/templates/nooma/TwoCards1/NoomaTwoCards1";
import { NoomaTwoCards2 } from "@/app/easyblocks/templates/nooma/TwoCards2/NoomaTwoCards2";
import { NoomaTwoCards3 } from "@/app/easyblocks/templates/nooma/TwoCards3/NoomaTwoCards3";
import { NoomaTwoCards4 } from "@/app/easyblocks/templates/nooma/TwoCards4/NoomaTwoCards4";
import { NoomaGrid1 } from "@/app/easyblocks/templates/nooma/Grid1/NoomaGrid1";
import { NoomaGrid2 } from "@/app/easyblocks/templates/nooma/Grid2/NoomaGrid2";
import { NoomaGrid3 } from "@/app/easyblocks/templates/nooma/Grid3/NoomaGrid3";
import { NoomaGrid4 } from "@/app/easyblocks/templates/nooma/Grid4/NoomaGrid4";
import { NoomaGrid5 } from "@/app/easyblocks/templates/nooma/Grid5/NoomaGrid5";
import { NoomaSlider1 } from "@/app/easyblocks/templates/nooma/Slider1/NoomaSlider1";
import { NoomaSlider2 } from "@/app/easyblocks/templates/nooma/Slider2/NoomaSlider2";

import { NoomaBasicCard1 } from "@/app/easyblocks/templates/nooma/BasicCard1/NoomaBasicCard1";
import { NoomaProductCard1 } from "@/app/easyblocks/templates/nooma/ProductCard1/NoomaProductCard1";
import { NoomaBasicCard2 } from "@/app/easyblocks/templates/nooma/BasicCard2/NoomaBasicCard2";
import { NoomaBasicCard3 } from "@/app/easyblocks/templates/nooma/BasicCard3/NoomaBasicCard3";
import { NoomaBasicCard4 } from "@/app/easyblocks/templates/nooma/BasicCard4/NoomaBasicCard4";
import { NoomaBasicCard5 } from "@/app/easyblocks/templates/nooma/BasicCard5/NoomaBasicCard5";

export const templates: Template[] = [
  {
    id: "BannerSection2_Empty",
    config: BannerSection2_empty,
    thumbnailLabel: "Empty Hero Banner",
  },
  NoomaBannerSection4,
  NoomaBannerSection1,
  NoomaBannerSection2,
  NoomaBannerSection3,
  NoomaBannerSection5,
  // {
  //   id: "BannerSection2_1",
  //   config: BannerSection2_1,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/3wMpj0Xc3iVLsmHDZNWfop/0f7f27c722867471ad3252db24db060e/Screenshot_2023-01-05_at_16.39.58.png",
  // },
  // {
  //   id: "BannerSection2_2",
  //   config: BannerSection2_2,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/6y3aaLBJtBdel9lVzq4kC6/30edf36b80ff7a1c7d106dc5212f923b/Screenshot_2023-01-05_at_16.51.52.png",
  // },
  // {
  //   id: "BannerSection2_3",
  //   config: BannerSection2_3,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/2seekiJ9JPtX6Bs2XkykfD/c5564774d3801310216b1a36519bdc6d/Screenshot_2023-01-05_at_16.26.25.png",
  // },
  // {
  //   id: "BannerSection2_4",
  //   config: BannerSection2_4,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/3hPZ9lwVuwnLeJEkGF6u5a/0c3ec8c1f971e8d35ff18721f70db9c7/Screenshot_2023-01-05_at_16.42.59.png",
  // },
  {
    id: "Slider_empty",
    config: Slider_empty,
    thumbnailLabel: "Empty Slider",
  },
  {
    id: "Grid_empty",
    config: Grid_empty,
    thumbnailLabel: "Empty Grid",
  },
  NoomaGrid1,
  NoomaGrid2,
  NoomaGrid3,
  NoomaGrid4,
  NoomaGrid5,
  NoomaSlider1,
  NoomaSlider2,

  // {
  //   id: "Slider_1",
  //   config: Slider_1,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/1mygpfpVvZrstkKOW20htZ/5c1b0dc84a76a2de55f9d4aa35ce7de9/Screenshot_2023-01-10_at_15.24.08.png",
  // },
  // {
  //   id: "Grid_1",
  //   config: Grid_1,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/6xg41VQFrbdEm1kBaGv6Mx/05ed9b15166878179985233a1f3fcd93/Screenshot_2023-01-10_at_14.50.03.png",
  // },
  // {
  //   id: "Grid_2",
  //   config: Grid_2,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/7xzBKOoXjQTveWR0s2xrFk/38497275050b63a325b073060fe2a95e/Screenshot_2023-01-10_at_14.51.52.png",
  // },
  // {
  //   id: "Grid_3",
  //   config: Grid_3,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/1MCxPW9bki1F7h0u91Dop5/1d588557a0bd940d66f21053c6d0bdc7/Screenshot_2023-01-10_at_14.55.28.png",
  // },
  {
    id: "TwoCards_Empty",
    config: TwoCards_empty,
    thumbnailLabel: "Empty Two Cards",
  },

  NoomaTwoCards1,
  NoomaTwoCards2,
  NoomaTwoCards3,
  NoomaTwoCards4,

  {
    id: "BasicCard_Empty",
    config: BasicCard_empty,
    thumbnailLabel: "Empty Basic Card",
  },
  NoomaBasicCard1,
  NoomaBasicCard2,
  NoomaBasicCard3,
  NoomaBasicCard4,
  NoomaBasicCard5,

  NoomaProductCard1,

  // {
  //   id: "TwoCards_1",
  //   config: TwoCards_1,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/3Fk9daUDbwxsIrOsVQbllD/926f0dc721035580fd174f314912e217/Screenshot_2023-01-10_at_16.06.29.png",
  // },
  // {
  //   id: "TwoCards_2",
  //   config: TwoCards_2,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/4V9ghYeSZW1oH90IsobBAi/ef224052e4a86a3156717b6a6cf1b808/Screenshot_2023-01-10_at_16.01.38.png",
  // },
  // {
  //   id: "TwoCards_3",
  //   config: TwoCards_3,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/YpzQca2WZ7CBsbtHm6Zwn/6c7fb212c54a0db21a9f7dfbf7433e60/Screenshot_2023-01-10_at_16.04.54.png",
  // },
  // {
  //   id: "TwoCards_4",
  //   config: TwoCards_4,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/2wxTGZlGN4XvAvlmZ7TNIx/303e535ececd313c361f19394a64dd28/Screenshot_2023-01-10_at_16.12.42.png",
  // },
  // {
  //   id: "BasicCard_1",
  //   config: BasicCard_1,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/4LG88ftm2PGgdRQaUoQXdd/ec35ee5e2a877c744f6781d1b7e1476d/Screenshot_2023-01-10_at_14.15.43.png",
  // },
  // {
  //   id: "BasicCard_2",
  //   config: BasicCard_2,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/3a7K5j9sC0M0yEmk15aHxT/467b4a1c13f3bb859216da98885900aa/Screenshot_2023-01-10_at_14.25.34.png",
  // },
  // {
  //   id: "BasicCard_3",
  //   config: BasicCard_3,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/6UTMn2F9dHYdYR6NlJZ7ME/44be0aacf9ee6cba2e8ce0f0104fe3bd/Screenshot_2023-01-10_at_14.30.09.png",
  // },
  // {
  //   id: "BasicCard_4",
  //   config: BasicCard_4,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/3quUYyWgLP3oCI64MaLFrQ/2e4e173902e393d4ceefd064fff733a1/Screenshot_2023-01-10_at_14.33.01.png",
  // },
  // {
  //   id: "BasicCard_5",
  //   config: BasicCard_5,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/2DMKw3UCWvHO0LrMLraSOu/8e7ce78be66fe717cdeb491f96d7cc7b/Screenshot_2023-01-10_at_14.38.20.png",
  // },
  // {
  //   id: "BasicCard_6",
  //   config: BasicCard_6,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/17qi4ft7IyA2MEjfHvzuyz/72cf0265e169fc13ab4f46bc909814bf/Screenshot_2023-01-10_at_14.41.35.png",
  // },
  // {
  //   id: "BasicCard_7",
  //   config: BasicCard_7,
  //   thumbnail:
  //     "https://images.ctfassets.net/blh4anz05qu1/4mRFPyFl2b1J68n8Sp5KzV/f87bb51535c986641f1c5d7d12694b2b/Screenshot_2023-01-10_at_14.43.48.png",
  // },
  {
    id: "ButtonGroup_default",
    label: "Default",
    // @ts-expect-error
    config: {
      _template: "$buttons",
      gap: {
        $res: true,
        xl: {
          ref: "12",
          value: "12px",
        },
      },
    },
  },
  {
    id: "Video_default",
    label: "Default",
    config: video,
  },
  {
    id: "RichText_default",
    label: "Default",
    config: buildRichTextNoCodeEntry({
      text: "Lorem ipsum",
      color: "grey_05",
      font: "body",
    }),
  },
  {
    id: "Button_standard",
    label: "Standard",
    thumbnail:
      "https://images.ctfassets.net/blh4anz05qu1/1LdC2xsiaoytmv2PgAnQQD/379daa392c46ff7a33761fb6f0a7d889/Screenshot_2023-10-06_at_13.59.15.png",
    config: Button_standard,
  },
  {
    id: "Button_standard_light",
    label: "Standard light",
    thumbnail:
      "https://images.ctfassets.net/blh4anz05qu1/5ZjWVxfWfAPLYivhp1nlUQ/360d5cb90b75cd51ad099447b2e4a5b1/Screenshot_2023-10-16_at_16.27.32.png",
    config: Button_standard_light,
  },
  {
    id: "Button_text",
    label: "Text",
    thumbnail:
      "https://images.ctfassets.net/blh4anz05qu1/7t6QX8UnUDcwvbVRvJrW5Z/6ce07aa0d99eee0977fb447e8a39810e/Screenshot_2023-10-16_at_16.28.54.png",
    config: Button_text,
  },
  {
    id: "Button_icon",
    label: "Icon standard",
    thumbnail:
      "https://images.ctfassets.net/blh4anz05qu1/5qsvp8xUQZjayKaj5XNmil/84f6f90a3c5779390e9eaabce5a3e1d3/Screenshot_2023-10-06_at_14.03.11.png",
    config: Button_icon_standard,
  },
];

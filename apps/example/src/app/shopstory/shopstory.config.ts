import { Config } from "@easyblocks/core";
import { builtinEditableComponentsDefinitions } from "@easyblocks/editable-components";

import { simpleBannerDefinition } from "@/app/shopstory/SimpleBanner/SimpleBannerDefinition";
import { simpleBanner2Definition } from "@/app/shopstory/SimpleBanner2/SimpleBanner2Definition";

export const shopstoryConfig: Config = {
  accessToken: process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN,
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
      defaultConfig: {
        _template: "$RootSections",
        data: [],
      },
    },
  },
  space: [
    {
      id: "containerMargin.default",
      value: {
        "@xs": 16,
        "@md": 32,
        "@lg": 64,
      },
    },
    {
      id: "containerMargin.small",
      value: {
        "@xs": 16,
        "@md": 64,
        "@lg": 128,
      },
    },
  ],
  colors: [
    {
      id: "transparent",
      value: "#00000000",
    },
    {
      id: "white",
      value: "#ffffff",
      mapTo: ["$light"],
    },
    {
      id: "black",
      value: "#000000",
      mapTo: ["$dark"],
    },
    {
      id: "beige",
      value: "#FFF5E0",
      mapTo: ["$backgroundLight"],
    },
    {
      id: "navy",
      value: "#141E46",
      mapTo: ["$backgroundDark"],
    },
    {
      id: "red",
      value: "#BB2525",
    },
    {
      id: "coral",
      value: "#FF6969",
    },
  ],
  components: [
    ...builtinEditableComponentsDefinitions,
    simpleBannerDefinition,
    simpleBanner2Definition,
  ],
};

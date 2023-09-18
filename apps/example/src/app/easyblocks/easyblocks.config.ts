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
      defaultConfig: {
        _template: "$RootSections",
        data: [],
      },
    },
    product: {
      defaultConfig: {
        _template: "$RootSections",
        data: [],
      },
      resource: {
        type: "product",
      },
    },
  },
  components: builtinEditableComponentsDefinitions,
  resourceTypes: {
    image: {
      widgets: [easyblocksImageWidget, pexelsImageWidget, productWidget],
    },
    video: {
      widgets: [easyblocksVideoWidget],
    },
    product: {
      widgets: [productWidget],
    },
  },
};

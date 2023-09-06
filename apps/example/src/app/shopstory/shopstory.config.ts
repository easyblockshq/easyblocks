import { Config } from "@easyblocks/core";
import { builtinEditableComponentsDefinitions } from "@easyblocks/editable-components";
import {
  easyblocksImageWidget,
  easyblocksVideoWidget,
  fetchEasyblocksMediaResources,
} from "@easyblocks/media";
import { fetchPexelsResources, pexelsImageWidget } from "./resources/pexels";
import { fetchProductResources, productWidget } from "./resources/product";

if (!process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN");
}

const easyblocksAccessToken = process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN;

export const shopstoryConfig: Config = {
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
  },
  components: builtinEditableComponentsDefinitions,
  async fetch(resources) {
    const [easyblocksResources, pexelsResources, productResources] =
      await Promise.all([
        fetchEasyblocksMediaResources(resources, easyblocksAccessToken),
        fetchPexelsResources(resources),
        fetchProductResources(resources),
      ]);

    return {
      ...easyblocksResources,
      ...pexelsResources,
      ...productResources,
    };
  },
  resourceTypes: {
    image: {
      widgets: [easyblocksImageWidget, pexelsImageWidget, productWidget],
    },
    video: {
      widgets: [easyblocksVideoWidget],
    },
  },
};

import { Config } from "@easyblocks/core";
import { builtinEditableComponentsDefinitions } from "@easyblocks/editable-components";
import {
  easyblocksImageWidget,
  easyblocksVideoWidget,
  fetchBuiltinMediaResources,
} from "@easyblocks/media";
import { fetchPexelsResources, pexelsImageWidget } from "./resources/pexels";

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
    const [builtinResources, pexelsResources] = await Promise.all([
      fetchBuiltinMediaResources(resources, easyblocksAccessToken),
      fetchPexelsResources(resources),
    ]);

    return {
      ...builtinResources,
      ...pexelsResources,
    };
  },
  resourceTypes: {
    image: {
      widgets: [easyblocksImageWidget, pexelsImageWidget],
    },
    video: {
      widgets: [easyblocksVideoWidget],
    },
  },
};

import { Config } from "@easyblocks/core";
import { builtinEditableComponentsDefinitions } from "@easyblocks/editable-components";
import { simpleBannerDefinition } from "@/app/shopstory/SimpleBanner/SimpleBannerDefinition";

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
  components: [...builtinEditableComponentsDefinitions, simpleBannerDefinition],
};

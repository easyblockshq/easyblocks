import {
  ExternalDataChangeHandler,
  FetchOutputResources,
  PendingExternalData,
} from "@easyblocks/core";
import { fetchEasyblocksMediaResources } from "@easyblocks/media";
import { fetchPexelsResources } from "./resources/pexels";
import { fetchProductResources } from "./resources/product";

const createMyCustomFetch: (
  accessToken: string
) => (resources: PendingExternalData) => Promise<FetchOutputResources> =
  (accessToken) => async (resources) => {
    const [easyblocksResources, pexelsResources, productResources] =
      await Promise.all([
        fetchEasyblocksMediaResources(resources, accessToken),
        fetchPexelsResources(resources),
        fetchProductResources(resources),
      ]);

    return {
      ...easyblocksResources,
      ...pexelsResources,
      ...productResources,
    };
  };

export { createMyCustomFetch };

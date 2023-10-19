import { ChangedExternalData, ExternalData } from "@easyblocks/core";
import { fetchPexelsResources } from "./resources/pexels/fetchPexelsResources";
import { fetchProductResources } from "./resources/product/fetchProductResources";
import { fetchMockImages } from "./externalData/mockMedia/fetchMockImages";
import { fetchMockVideos } from "./externalData/mockMedia/fetchMockVideos";

const createMyCustomFetch: (
  accessToken: string
) => (resources: ChangedExternalData) => Promise<ExternalData> =
  (accessToken) => async (resources) => {
    const [mockImages, mockVideos, pexelsImages, products] = await Promise.all([
      fetchMockImages(resources),
      fetchMockVideos(resources),
      fetchPexelsResources(resources),
      fetchProductResources(resources),
    ]);

    return {
      ...mockImages,
      ...mockVideos,
      ...pexelsImages,
      ...products,
    };
  };

export { createMyCustomFetch };

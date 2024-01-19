import { ChangedExternalData, ExternalData } from "@easyblocks/core";
import { fetchPexelsResources } from "./externalData/pexels/fetchPexelsResources";
import { fetchProductResources } from "./externalData/product/fetchProductResources";
import { fetchMockImages } from "./externalData/mockMedia/fetchMockImages";
import { fetchMockVideos } from "./externalData/mockMedia/fetchMockVideos";

const createMyCustomFetch: () => (
  resources: ChangedExternalData
) => Promise<ExternalData> = () => async (resources) => {
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

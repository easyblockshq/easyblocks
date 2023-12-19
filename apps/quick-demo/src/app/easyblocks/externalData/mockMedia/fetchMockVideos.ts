import { ChangedExternalData, ExternalData } from "@easyblocks/core";
import { MOCK_ASSETS } from "./mockAssets";

export async function fetchMockVideos(
  externalData: ChangedExternalData
): Promise<ExternalData> {
  const allResources = Object.entries(externalData).filter(
    ([, resource]) => resource.widgetId === "mockVideo"
  );

  if (allResources.length === 0) {
    return {};
  }

  const results: Record<string, any> = {};

  allResources.forEach(([fieldId, { id }]) => {
    const asset = MOCK_ASSETS.find((asset) => asset.id === id);

    if (!asset) {
      results[fieldId] = {
        error: new Error("error while fetching asset"),
      };
      return;
    }

    let aspectRatio = 1;
    if (asset.width !== undefined && asset.height !== undefined) {
      aspectRatio = asset.width / asset.height;
    }

    results[fieldId] = {
      type: "@easyblocks/video",
      value: {
        url: asset.url,
        alt: asset.title,
        aspectRatio,
      },
    };
  });

  return results;
}

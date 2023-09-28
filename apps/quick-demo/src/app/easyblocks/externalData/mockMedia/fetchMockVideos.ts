import { ChangedExternalData, ExternalData } from "@easyblocks/core";
import { fetchAssetsFromContentful } from "@/app/easyblocks/externalData/mockMedia/fetchAssetsFromContentful";

export async function fetchMockVideos(
  externalData: ChangedExternalData
): Promise<ExternalData> {
  const allResources = Object.entries(externalData).filter(
    ([, resource]) => resource.widgetId === "mockVideo"
  );

  if (allResources.length === 0) {
    return {};
  }

  const assets = await fetchAssetsFromContentful("video");
  const results: Record<string, any> = {};

  allResources.forEach(([fieldId, { externalId }]) => {
    const asset = assets.find((asset) => asset.id === externalId);

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
      type: "video",
      value: {
        url: asset.url,
        alt: asset.title,
        aspectRatio,
      },
    };
  });

  return results;
}

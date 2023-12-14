import { ChangedExternalData, ExternalData } from "@easyblocks/core";
import { fetchAssetsFromContentful } from "@/app/easyblocks/externalData/mockMedia/fetchAssetsFromContentful";

export async function fetchMockImages(
  externalData: ChangedExternalData
): Promise<ExternalData> {
  const allResources = Object.entries(externalData).filter(
    ([, resource]) => resource.widgetId === "mockImage"
  );

  if (allResources.length === 0) {
    return {};
  }

  const assets = await fetchAssetsFromContentful("image");
  const results: Record<string, any> = {};

  allResources.forEach(([fieldId, { id }]) => {
    const asset = assets.find((asset) => asset.id === id);

    if (!asset) {
      results[fieldId] = {
        error: new Error("error while fetching asset"),
      };
      return;
    }

    let aspectRatio = 1;
    let width = 500;
    let height = 500;
    if (asset.width !== undefined && asset.height !== undefined) {
      aspectRatio = asset.width / asset.height;
      width = asset.width;
      height = asset.height;
    }

    results[fieldId] = {
      type: "@easyblocks/image",
      value: {
        url: asset.url,
        alt: asset.title,
        aspectRatio,
        mimeType: asset.mimeType,
        srcset: [
          {
            w: width,
            h: height,
            url: asset.url,
          },
        ],
      },
    };
  });

  return results;
}

import type { AssetDTO } from "@easyblocks/core";
import type { Media } from "./mediaPicker";

function mediaAdapter(asset: AssetDTO): Media {
  const isVideo = asset.mediaType === "video";

  return {
    id: asset.id,
    title: asset.name,
    url: asset.url,
    thumbnail: isVideo ? undefined : asset.url,
    mimeType: asset.metadata.mimeType,
    isVideo,
    width: isVideo ? undefined : asset.metadata.width,
    height: isVideo ? undefined : asset.metadata.height,
  };
}

export { mediaAdapter };

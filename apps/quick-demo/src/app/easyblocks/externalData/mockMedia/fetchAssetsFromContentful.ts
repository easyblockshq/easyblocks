import { createClient, Entry, Asset } from "contentful";
import { Media } from "./Media";

const CONTENTFUL_SPACE_ID = "blh4anz05qu1";
const CONTENTFUL_ACCESS_TOKEN = "lYW4u-PLH0lAAzFqWUwfSluHeC-jL1MF0XIoTYlXAjI";
const CONTENTFUL_ENTRY_ID = "7mtl3GDg8URDZjaSgMBeMo";

async function getAssetsEntry(): Promise<Entry<any>> {
  const contentfulClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });

  try {
    return await contentfulClient.getEntry(CONTENTFUL_ENTRY_ID);
  } catch (error) {
    throw error;
  }
}

async function fetchAssetsFromContentful(
  mediaType: "image" | "video"
): Promise<Media[]> {
  try {
    const entry = await getAssetsEntry();

    if (mediaType === "image") {
      return entry.fields.images.map((asset: Asset) => ({
        id: asset.sys.id,
        title: asset.fields.title,
        url: `https:${asset.fields.file.url}`,
        thumbnail: `https:${asset.fields.file.url}`,
        width: asset.fields.file.details.image?.width,
        height: asset.fields.file.details.image?.height,
        mimeType: asset.fields.file.contentType,
        isVideo: false,
      }));
    } else {
      return entry.fields.videos.map((asset: Entry<any>) => ({
        id: asset.sys.id,
        title: asset.fields.title,
        url: `https:${asset.fields.video.fields.file.url}`,
        thumbnail: `https:${asset.fields.poster.fields.file.url}`,
        width: asset.fields.width,
        height: asset.fields.height,
        mimeType: asset.fields.video.fields.file.contentType,
        isVideo: true,
      }));
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { fetchAssetsFromContentful };

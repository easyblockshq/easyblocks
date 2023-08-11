import { FetchResourcesOutput, LauncherPlugin, Plugin } from "@easyblocks/core";
import { createClient, Entry } from "contentful";
import { mediaAdapter } from "./mediaAdapter";
import { Media } from "./mockMediaPicker";

function createContentfulClient() {
  const shouldUsePreview = false;

  return createClient({
    space: "blh4anz05qu1",
    accessToken: shouldUsePreview
      ? "2OqujCwpaLi_bz7mHNrFUthl2aidK0UgVeumw_2vlsc"
      : "lYW4u-PLH0lAAzFqWUwfSluHeC-jL1MF0XIoTYlXAjI",
    host: shouldUsePreview ? "preview.contentful.com" : undefined,
  });
}

export async function fetchImages(): Promise<Media[]> {
  const contentfulClient = createContentfulClient();

  const entries = await contentfulClient.getEntries({
    content_type: "playgroundImages",
    include: 2,
  });

  const images: any[] = (entries.items[0] as Entry<any>).fields.images;

  return images.map((image) => ({
    id: image.sys.id,
    title: image.fields.title,
    url: `https:${image.fields.file.url}?fm=webp&w=1920`,
    thumbnail: `https:${image.fields.file.url}?fm=webp&w=400`,
    width: image.fields.file.details.image.width,
    height: image.fields.file.details.image.height,
    mimeType: image.fields.file.contentType,
    isVideo: false,
  }));
}

export async function fetchVideos(): Promise<Media[]> {
  const contentfulClient = createContentfulClient();

  const entries = await contentfulClient.getEntries({
    content_type: "playgroundImages",
    include: 3,
  });

  const videos: any[] = (entries.items[0] as Entry<any>).fields.videos;

  return videos.map((video) => ({
    id: video.sys.id,
    title: video.fields.title,
    thumbnail: `https:${video.fields.poster.fields.file.url}?fm=webp&w=400`,
    width: video.fields.width,
    height: video.fields.height,
    url: `https:${video.fields.video.fields.file.url}`,
    mimeType: video.fields.video.fields.file.contentType,
    isVideo: true,
  }));
}

export const noCMSPlugin: Plugin = {
  id: "nocms",
  resources: {
    "nocms.image": {
      defaultFetch: async (resources, { apiClient, projectId }) => {
        const assets = await fetchImages();

        const result: Array<FetchResourcesOutput> = resources.map(
          (resource) => ({
            ...resource,
            value: assets.find((asset) => asset.id === resource.id),
          })
        );

        if (projectId) {
          const missingImages = result.filter((x) => !x.value);

          if (missingImages.length > 0) {
            const missingImagesIds = missingImages.map((x) => x.id);
            const imageAssets = await apiClient.assets.getAssets({
              projectId,
              ids: missingImagesIds,
            });

            result.forEach((resource) => {
              const value = imageAssets.find((x) => x.id === resource.id);
              if (value) {
                resource.value = mediaAdapter(value);
              }
            });
          }
        }

        return result;
      },
      widget: () => {
        return {
          type: "custom",
          component: () => {
            throw new Error(
              "This method is not available in Server Components"
            );
          },
        };
      },
    },
    "nocms.video": {
      defaultFetch: async (resources, { apiClient, projectId }) => {
        const assets = await fetchVideos();

        const result: Array<FetchResourcesOutput> = resources.map(
          (resource) => ({
            ...resource,
            value: assets.find((asset) => asset.id === resource.id),
          })
        );

        if (projectId) {
          const missingVideos = result.filter((x) => !x.value);

          if (missingVideos.length > 0) {
            const missingVideosIds = missingVideos.map((x) => x.id);
            const videoAssets = await apiClient.assets.getAssets({
              projectId,
              ids: missingVideosIds,
            });

            result.forEach((resource) => {
              const value = videoAssets.find((x) => x.id === resource.id);
              if (value) {
                resource.value = mediaAdapter(value);
              }
            });
          }
        }

        return result;
      },
      widget: () => {
        return {
          type: "custom",
          component: () => {
            throw new Error(
              "This method is not available in Server Components"
            );
          },
        };
      },
    },
  },
};

export const noCMSLauncherPlugin: LauncherPlugin = {
  id: "nocms",
  resources: noCMSPlugin.resources!,
  launcher: {
    image: {
      resourceType: "nocms.image",
      transform: (x: any) => ({
        url: x.url,
        alt: x.title,
        aspectRatio: x.width / x.height,
        mimeType: x.mimeType,
        srcset: [
          {
            w: x.width,
            h: x.height,
            url: x.url,
          },
        ],
      }),
    },
    video: {
      resourceType: "nocms.video",
      transform: (x: any) => {
        return {
          url: x.url,
          alt: x.title,
          aspectRatio: x.width / x.height,
        };
      },
    },
    onEditorLoad: () => {
      throw new Error("This method is not available in Server Components");
    },
  },
};

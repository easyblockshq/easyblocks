import {
  ApiClient,
  AssetDTO,
  FetchInputResources,
  FetchOutputResources,
  ImageSrc,
  ShopstoryAccessTokenApiAuthenticationStrategy,
  VideoSrc,
  Widget,
} from "@easyblocks/core";
import { createClient, Entry } from "contentful";
import type { Media } from "./mockMediaPicker";
import { nonNullable } from "@easyblocks/utils";

type Entries<T extends Record<string, unknown>> = [keyof T, T[keyof T]];

export const easyblocksImageWidget: Widget = {
  id: "@easyblocks/image",
  label: "No CMS",
  component: () => {
    throw new Error("This method is not available in Server Components");
  },
};

export const easyblocksVideoWidget: Widget = {
  id: "@easyblocks/video",
  label: "No CMS",
  component: () => {
    throw new Error("This method is not available in Server Components");
  },
};

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

export async function fetchBuiltinMediaResources(
  resources: FetchInputResources,
  accessToken: string
): Promise<FetchOutputResources> {
  const mediaInputResources = Object.entries(resources).filter(
    ([, resource]) =>
      (resource.type === "image" &&
        resource.widgetId === easyblocksImageWidget.id) ||
      (resource.type === "video" &&
        resource.widgetId === easyblocksVideoWidget.id)
  );

  if (mediaInputResources.length === 0) {
    return Promise.resolve({});
  }

  const apiClient = new ApiClient(
    new ShopstoryAccessTokenApiAuthenticationStrategy(accessToken)
  );
  const projectsResponse = await apiClient.get(`/projects`);

  if (!projectsResponse.ok) {
    return Promise.resolve({});
  }

  const projects = await projectsResponse.json();

  if (projects.length === 0) {
    return Promise.resolve({});
  }

  const assets = await apiClient.assets.getAssets({
    projectId: projects[0].id,
    ids: mediaInputResources.map(([, resource]) => resource.externalId),
  });

  const fetchResult = Object.fromEntries(
    assets
      .map<Entries<FetchOutputResources> | null>((asset) => {
        const inputResource = mediaInputResources.find(
          ([, resource]) => resource.externalId === asset.id
        );

        if (!inputResource) {
          return null;
        }

        return [
          inputResource[0],
          {
            type: asset.mediaType,
            value: {
              value: createMediaFromAsset(asset),
            },
          },
        ];
      })
      .filter<Entries<FetchOutputResources>>(nonNullable())
  );

  return fetchResult;
}

function createMediaFromAsset(asset: AssetDTO): ImageSrc | VideoSrc {
  return asset.mediaType === "image"
    ? {
        url: asset.url,
        alt: asset.name,
        aspectRatio: asset.metadata.width / asset.metadata.height,
        mimeType: asset.metadata.mimeType,
        srcset: [
          {
            w: asset.metadata.width,
            h: asset.metadata.height,
            url: asset.url,
          },
        ],
      }
    : {
        alt: asset.name,
        aspectRatio: 1,
        url: asset.url,
      };
}

// export async function fetchBuiltinMediaResources(
//   resources: FetchInputResources
// ): Promise<FetchOutputResources> {
//   const imageResources = Object.entries(resources).filter(
//     ([, resource]) =>
//       resource.type === "image" &&
//       resource.widgetId === easyblocksImageWidget.id
//   );
//   const videoResources = Object.entries(resources).filter(
//     ([, resource]) =>
//       resource.type === "video" &&
//       resource.widgetId === easyblocksVideoWidget.id
//   );

//   async function fetchImageResources(): Promise<FetchOutputResources> {
//     const assets = await fetchImages();

//     const result = Object.fromEntries(
//       imageResources.map<[string, FetchOutputResources[string]]>(
//         ([id, resource]) => {
//           const asset = assets.find(
//             (asset) => asset.id === resource.externalId
//           );

//           if (asset) {
//             const adaptedAsset: ImageSrc = {
//               url: asset.url,
//               alt: asset.title,
//               aspectRatio: asset.width! / asset.height!,
//               mimeType: asset.mimeType,
//               srcset: [
//                 {
//                   w: asset.width!,
//                   h: asset.height!,
//                   url: asset.url,
//                 },
//               ],
//             };

//             return [id, { type: "image", value: { value: adaptedAsset } }];
//           } else {
//             return [
//               id,
//               {
//                 type: "image",
//                 value: { error: new Error(`Image with id "${id}" not found`) },
//               },
//             ];
//           }
//         }
//       )
//     );

//     return result;
//   }

//   async function fetchVideoResources(): Promise<
//     Record<string, { value: any } | { error: Error }>
//   > {
//     const assets = await fetchVideos();

//     const result = Object.fromEntries(
//       videoResources.map<[string, FetchOutputResources[string]]>(
//         ([id, resource]) => {
//           const asset = assets.find(
//             (asset) => asset.id === resource.externalId
//           );

//           if (asset) {
//             const adaptedAsset: VideoSrc = {
//               url: asset.url,
//               alt: asset.title,
//               aspectRatio: asset.width! / asset.height!,
//             };

//             return [id, { type: "video", value: { value: adaptedAsset } }];
//           } else {
//             return [
//               id,
//               {
//                 type: "video",
//                 value: { error: new Error(`Video with id "${id}" not found`) },
//               },
//             ];
//           }
//         }
//       )
//     );

//     return result;
//   }

//   const [imageResourcesResult, videoResourcesResult] = await Promise.allSettled(
//     [fetchImageResources(), fetchVideoResources()]
//   );

//   const result: FetchOutputResources = {};

//   if (imageResourcesResult.status === "fulfilled") {
//     Object.assign(result, imageResourcesResult.value);
//   }

//   if (videoResourcesResult.status === "fulfilled") {
//     Object.assign(result, videoResourcesResult.value);
//   }

//   return result;
// }

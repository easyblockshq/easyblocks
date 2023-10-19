import type {
  ChangedExternalData,
  ExternalData,
  ImageSrc,
  VideoSrc,
} from "@easyblocks/core";

import {
  PEXELS_VIDEO_WIDGET_ID,
  PEXELS_IMAGE_WIDGET_ID,
  pexelsApiFetch,
} from "./pexelsShared";

export async function fetchPexelsResources(
  externalData: ChangedExternalData
): Promise<ExternalData> {
  const pexelsPhotoResources = Object.entries(externalData).filter(
    ([, resource]) => {
      return (
        resource.widgetId === PEXELS_IMAGE_WIDGET_ID &&
        resource.externalId !== null
      );
    }
  );

  const pexelsVideoResources = Object.entries(externalData).filter(
    ([, resource]) => {
      return (
        resource.widgetId === PEXELS_VIDEO_WIDGET_ID &&
        resource.externalId !== null
      );
    }
  );

  const photos = await Promise.all(
    pexelsPhotoResources.map(([, resource]) => {
      return pexelsApiFetch(`/v1/photos/${resource.externalId}`).then((res) =>
        res.json()
      );
    })
  );

  const videos = await Promise.all(
    pexelsVideoResources.map(([, resource]) => {
      return pexelsApiFetch(`/v1/photos/${resource.externalId}`).then((res) =>
        res.json()
      );
    })
  );

  const photosResults = Object.fromEntries(
    pexelsPhotoResources.map(([id, inputResource]) => {
      // Pexels API returns id as a number
      const photo = photos.find(
        (p) => p.id.toString() === inputResource.externalId
      );

      if (!photo) {
        return [
          id,
          {
            error: new Error("Photo not found"),
          },
        ];
      }

      const photoValue: ImageSrc = {
        alt: photo.alt,
        aspectRatio: photo.width / photo.height,
        mimeType: "image/jpeg",
        srcset: [
          {
            h: photo.height,
            url: photo.src.large2x,
            w: photo.width,
          },
        ],
        url: photo.src.large2x,
      };

      return [
        id,
        {
          type: "image",
          value: photoValue,
        },
      ];
    })
  );

  const videosResults = Object.fromEntries(
    pexelsVideoResources.map(([id, inputResource]) => {
      const video = videos.find(
        // Pexels API returns id as a number
        (p) => p.id.toString() === inputResource.externalId
      );

      if (!video) {
        return [
          id,
          {
            error: new Error("Video not found"),
          },
        ];
      }

      const videoValue: VideoSrc = {
        alt: video.id,
        aspectRatio: 1,
        url: video.video_files.find((f: any) => f.quality === "hd").link,
      };

      return [
        id,
        {
          type: "video",
          value: videoValue,
        },
      ];
    })
  );

  return { ...photosResults, ...videosResults };
}

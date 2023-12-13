import type {
  ChangedExternalData,
  ExternalData,
  ImageSrc,
  VideoSrc,
  Widget,
} from "@easyblocks/core";
import { SimplePicker } from "@easyblocks/design-system";

const pexelsApiKey = "us4Cvb33zDTkpH0RqYmuSgzyx0Nnc4qwDkIMkDMOuCw5giL06WmSONgY";

const pexelsApiFetch: (path: `/${string}`) => Promise<Response> = async (
  path
) => {
  return fetch(`https://api.pexels.com${path}`, {
    headers: {
      Authorization: pexelsApiKey,
    },
  });
};

const pexelsImageWidget: Widget = {
  id: "@pexels/photo",
  label: "Pexels",
  component: ({ id, onChange }) => {
    return (
      <SimplePicker
        value={id}
        onChange={onChange}
        getItems={async (query) => {
          const response = await pexelsApiFetch(
            query
              ? `/v1/search?query=${query}`
              : // Pexels API returns 400 if no query is provided, so let's use curated images instead in that case
                "/v1/curated"
          );

          const data = await response.json();

          return data.photos.map((photo: any) => {
            return {
              id: photo.id.toString(),
              title: photo.id.toString(),
              thumbnail: photo.src.small,
            };
          });
        }}
        getItemById={async (id) => {
          const response = await pexelsApiFetch(`/v1/photos/${id}`);

          const photo = await response.json();

          return {
            id: photo.id.toString(),
            title: photo.id.toString(),
            thumbnail: photo.src.small,
          };
        }}
      />
    );
  },
};

const pexelsVideoWidget: Widget = {
  id: "@pexels/video",
  label: "Pexels",
  component: ({ id, onChange }) => {
    return (
      <SimplePicker
        value={id}
        onChange={onChange}
        getItems={async (query) => {
          const response = await pexelsApiFetch(
            query
              ? `/videos/search?query=${query}`
              : // Pexels API returns 400 if no query is provided, so let's use popular videos instead in that case
                "/videos/popular"
          );

          const data = await response.json();

          return data.videos.map((video: any) => {
            return {
              id: video.id.toString(),
              title: video.id.toString(),
              thumbnail: video.image,
            };
          });
        }}
        getItemById={async (id) => {
          const response = await pexelsApiFetch(`/videos/videos/${id}`);

          const video = await response.json();

          return {
            id: video.id.toString(),
            title: video.id.toString(),
            thumbnail: video.image,
          };
        }}
      />
    );
  },
};

async function fetchPexelsResources(
  externalData: ChangedExternalData
): Promise<ExternalData> {
  const pexelsPhotoResources = Object.entries(externalData).filter(
    ([, resource]) => {
      return resource.widgetId === pexelsImageWidget.id && resource.id !== null;
    }
  );

  const pexelsVideoResources = Object.entries(externalData).filter(
    ([, resource]) => {
      return resource.widgetId === pexelsVideoWidget.id && resource.id !== null;
    }
  );

  const photos = await Promise.all(
    pexelsPhotoResources.map(([, resource]) => {
      return pexelsApiFetch(`/v1/photos/${resource.id}`).then((res) =>
        res.json()
      );
    })
  );

  const videos = await Promise.all(
    pexelsVideoResources.map(([, resource]) => {
      return pexelsApiFetch(`/v1/photos/${resource.id}`).then((res) =>
        res.json()
      );
    })
  );

  const photosResults = Object.fromEntries(
    pexelsPhotoResources.map(([id, inputResource]) => {
      // Pexels API returns id as a number
      const photo = photos.find((p) => p.id.toString() === inputResource.id);

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
        (p) => p.id.toString() === inputResource.id
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

export { pexelsImageWidget, pexelsVideoWidget, fetchPexelsResources };

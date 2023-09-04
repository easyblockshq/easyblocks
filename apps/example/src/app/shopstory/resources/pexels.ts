import type {
  FetchInputResources,
  FetchOutputResources,
  ImageSrc,
  VideoSrc,
  Widget,
  WidgetComponent,
} from "@shopstory/core";

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

const pexelsImageWidgetComponent: WidgetComponent = {
  type: "item-picker",
  async getItemById(id) {
    const response = await pexelsApiFetch(`/v1/photos/${id}`);

    const photo = await response.json();

    return {
      id: photo.id.toString(),
      title: photo.id.toString(),
      thumbnail: photo.src.small,
    };
  },
  async getItems(query) {
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
  },
};

const pexelsVideoWidgetComponent: WidgetComponent = {
  type: "item-picker",
  async getItemById(id) {
    const response = await pexelsApiFetch(`/videos/videos/${id}`);

    const video = await response.json();

    return {
      id: video.id.toString(),
      title: video.id.toString(),
      thumbnail: video.image,
    };
  },
  async getItems(query) {
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
  },
};

const pexelsImageWidget: Widget = {
  id: "@pexels/photo",
  label: "Pexels",
  component: pexelsImageWidgetComponent,
};

const pexelsVideoWidget: Widget = {
  id: "@pexels/video",
  label: "Pexels",
  component: pexelsVideoWidgetComponent,
};

async function fetchPexelsResources(
  resources: FetchInputResources
): Promise<FetchOutputResources> {
  const pexelsPhotoResources = Object.entries(resources).filter(
    ([, resource]) => {
      return (
        resource.type === "image" && resource.widgetId === pexelsImageWidget.id
      );
    }
  );

  const pexelsVideoResources = Object.entries(resources).filter(
    ([, resource]) => {
      return (
        resource.type === "video" && resource.widgetId === pexelsVideoWidget.id
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
    photos.map<[string, FetchOutputResources[string]]>((photo, index) => {
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
        pexelsPhotoResources[index][0],
        {
          type: "image",
          value: {
            value: photoValue,
          },
        },
      ];
    })
  );

  const videosResults = Object.fromEntries(
    videos.map<[string, FetchOutputResources[string]]>((video, index) => {
      const videoValue: VideoSrc = {
        alt: video.id,
        aspectRatio: 1,
        url: video.video_files.find((f: any) => f.quality === "hd").link,
      };

      return [
        pexelsVideoResources[index][0],
        {
          type: "video",
          value: {
            value: videoValue,
          },
        },
      ];
    })
  );

  return { ...photosResults, ...videosResults };
}

export { pexelsImageWidget, pexelsVideoWidget, fetchPexelsResources };

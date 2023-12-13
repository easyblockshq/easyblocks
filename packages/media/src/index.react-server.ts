import type {
  AssetDTO,
  ChangedExternalData,
  ExternalData,
  IApiClient,
  ImageSrc,
  VideoSrc,
  Widget,
} from "@easyblocks/core";
import {
  ApiClient,
  ShopstoryAccessTokenApiAuthenticationStrategy,
} from "@easyblocks/core";

export const easyblocksImageWidget: Widget = {
  id: "@easyblocks/image",
  label: "No CMS",
};

export const easyblocksImageWidgetComponent = () => {
  throw new Error("This method is not available in Server Components");
};

export const easyblocksVideoWidget: Widget = {
  id: "@easyblocks/video",
  label: "No CMS",
};

export const easyblocksVideoWidgetComponent = () => {
  throw new Error("This method is not available in Server Components");
};

export async function fetchEasyblocksMediaResources(
  externalData: ChangedExternalData,
  accessToken: string
): Promise<ExternalData> {
  const mediaInputResources = Object.entries(externalData).filter(
    ([, resource]) =>
      resource.widgetId === easyblocksImageWidget.id ||
      resource.widgetId === easyblocksVideoWidget.id
  );

  if (mediaInputResources.length === 0) {
    return {};
  }

  const apiClient = new ApiClient(
    new ShopstoryAccessTokenApiAuthenticationStrategy(accessToken)
  );
  const projectId = await getProjectIdFromAccessToken(apiClient);

  if (!projectId) {
    return {};
  }

  const requestedAssetsIds = mediaInputResources
    .map(([, resource]) => resource.id)
    .filter<string>((externalId): externalId is string => externalId !== null);

  const assets = await apiClient.assets.getAssets({
    projectId,
    ids: requestedAssetsIds,
  });

  const fetchResult = Object.fromEntries(
    mediaInputResources.map(([id, inputResource]) => {
      const asset = assets.find((a) => inputResource.id === a.id);

      if (!asset) {
        return [
          id,
          {
            error: new Error(`Asset with id "${inputResource.id}" not found`),
          },
        ];
      }

      return [
        id,
        {
          type: inputResource.type,
          value: createMediaFromAsset(asset),
        },
      ];
    })
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

async function getProjectIdFromAccessToken(
  apiClient: IApiClient
): Promise<string | null> {
  const projectsResponse = await apiClient.get(`/projects`);

  if (!projectsResponse.ok) {
    return null;
  }

  const projects = await projectsResponse.json();

  if (projects.length === 0) {
    return null;
  }

  return projects[0].id;
}

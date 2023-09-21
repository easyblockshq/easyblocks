import {
  ApiClient,
  AssetDTO,
  ChangedExternalData,
  ExternalData,
  FetchOutputBasicResources,
  IApiClient,
  ImageSrc,
  ShopstoryAccessTokenApiAuthenticationStrategy,
  VideoSrc,
  Widget,
} from "@easyblocks/core";

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
    .map(([, resource]) => resource.externalId)
    .filter<string>((externalId): externalId is string => externalId !== null);

  const assets = await apiClient.assets.getAssets({
    projectId,
    ids: requestedAssetsIds,
  });

  const fetchResult = Object.fromEntries(
    mediaInputResources.map<Entries<FetchOutputBasicResources>>(
      ([id, inputResource]) => {
        const asset = assets.find((a) => inputResource.externalId === a.id);

        if (!asset) {
          return [
            id,
            {
              type: inputResource.type,
              value: undefined,
              error: new Error(
                `Asset with id "${inputResource.externalId}" not found`
              ),
            },
          ];
        }

        return [
          id,
          {
            type: inputResource.type,
            value: createMediaFromAsset(asset),
            error: null,
          },
        ];
      }
    )
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

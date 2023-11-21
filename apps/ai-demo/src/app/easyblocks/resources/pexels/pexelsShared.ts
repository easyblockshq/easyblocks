export const PEXELS_VIDEO_WIDGET_ID = "@pexels/video";
export const PEXELS_IMAGE_WIDGET_ID = "@pexels/photo";

const pexelsApiKey = "us4Cvb33zDTkpH0RqYmuSgzyx0Nnc4qwDkIMkDMOuCw5giL06WmSONgY";

export const pexelsApiFetch: (path: `/${string}`) => Promise<Response> = async (
  path
) => {
  return fetch(`https://api.pexels.com${path}`, {
    headers: {
      Authorization: pexelsApiKey,
    },
  });
};

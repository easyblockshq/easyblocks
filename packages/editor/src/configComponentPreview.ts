import { ContextParams, getDefaultLocale, Locale } from "@easyblocks/core";

function isLocalhost() {
  return (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === ""
  );
}

function getConfigPreviewUrl({
  configId,
  accessToken,
  version,
  contextParams,
}: {
  configId: string;
  version?: number;
  accessToken: string;
  contextParams: ContextParams;
}): string {
  // 1. Get current URL
  const currentUrl = window.location.href;

  // 2. Remove query params
  const urlWithoutQueryParams = currentUrl.split("?")[0];

  // 3. Add new query param
  const searchParams = new URLSearchParams();
  searchParams.set("configId", configId);
  if (version) {
    searchParams.set("version", version.toString());
  }
  searchParams.set("accessToken", accessToken);
  searchParams.set(
    "contextParams",
    encodeURIComponent(JSON.stringify(contextParams))
  );
  searchParams.set("mode", "app");

  // 4. Generate new URL string
  const newUrl = `${urlWithoutQueryParams}?${searchParams.toString()}`;
  return newUrl;
}

function getComponentConfigPreviewImageURL({
  configId,
  contextParams,
  locales,
  project,
  version,
}: {
  configId: string;
  version?: number;
  project: { id: string; name: string; token: string };
  locales: Array<Locale>;
  contextParams: ContextParams;
}): string | undefined {
  const defaultLocale = getDefaultLocale(locales);

  if (!defaultLocale) {
    throw new Error("Default locale not found");
  }

  // we generate screenshot only if template config is remote
  const url = getConfigPreviewUrl({
    configId,
    version,
    accessToken: project.token,
    contextParams: {
      ...contextParams,
      locale: defaultLocale.code,
    },
  });

  const searchParams = new URLSearchParams();
  searchParams.set("access_key", "yeKG1SmUryGzuw");
  searchParams.set("url", url);
  searchParams.set("cache", "true");
  searchParams.set("format", "jpg");
  searchParams.set("block_cookie_banners", "true");
  searchParams.set("block_trackers", "true");
  searchParams.set("device_scale_factor", "1");
  searchParams.set("selector", "#__shopstory-container");

  const screenshotPreviewUrl = `https://api.screenshotone.com/take?${searchParams.toString()}`;

  if (isLocalhost()) {
    console.log(`(localhost) Preview URL: ${url}`);
    return;
  }

  return screenshotPreviewUrl;
}

export { getComponentConfigPreviewImageURL };

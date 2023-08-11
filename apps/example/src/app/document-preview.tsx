"use client";

import { ContextParams } from "@easyblocks/core";

function DocumentPreview({
  configId,
  accessToken,
  version,
}: {
  configId: string;
  accessToken: string;
  version?: number;
}) {
  return (
    <img
      src={getComponentConfigPreviewImageURL({
        configId: configId,
        contextParams: {
          locale: "en-US",
        },
        accessToken,
        version,
      })}
      className="w-full h-80 bg-slate-600 mb-2 object-contain"
    />
  );
}

export { DocumentPreview };

function getComponentConfigPreviewImageURL({
  configId,
  contextParams,
  accessToken,
  version,
}: {
  configId: string;
  version?: number;
  accessToken: string;
  contextParams: ContextParams;
}): string | undefined {
  // we generate screenshot only if template config is remote
  const url = getConfigPreviewUrl({
    configId,
    version,
    accessToken,
    contextParams: {
      ...contextParams,
      locale: "en-US",
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
  const newUrl = `${urlWithoutQueryParams}shopstory-canvas?${searchParams.toString()}`;
  return newUrl;
}

function isLocalhost() {
  return (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === ""
  );
}

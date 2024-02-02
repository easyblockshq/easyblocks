export function generatePreviewUrl(params: {
  id: string;
  projectId: string;
  version: number;
  contextParams: Record<string, any>;
  accessToken: string;
  canvasUrl: string;
}): string {
  const previewUrl = `${params.canvasUrl}?documentId=${params.id}&projectId=${
    params.projectId
  }&accessToken=${params.accessToken}&contextParams=${JSON.stringify(
    params.contextParams
  )}&preview=true&version=${params.version}`;

  if (isLocalhost()) {
    return "https://placehold.co/600x400";
  }

  const searchParams = new URLSearchParams();
  searchParams.set("access_key", "yeKG1SmUryGzuw");
  searchParams.set("url", previewUrl);
  searchParams.set("cache", "true");
  searchParams.set("format", "jpg");
  searchParams.set("block_cookie_banners", "true");
  searchParams.set("block_trackers", "true");
  searchParams.set("device_scale_factor", "1");
  searchParams.set("selector", "#__shopstory-container");

  const screenshotPreviewUrl = `https://api.screenshotone.com/take?${searchParams.toString()}`;
  return screenshotPreviewUrl;
}

function isLocalhost() {
  return (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === ""
  );
}

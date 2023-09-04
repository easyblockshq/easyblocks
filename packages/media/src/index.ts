import type { Widget } from "@easyblocks/core";
import { fetchImages, fetchVideos } from "./index.react-server";
import { mockMediaPicker } from "./mockMediaPicker";

export { fetchBuiltinMediaResources } from "./index.react-server";

export const easyblocksImageWidget: Widget = {
  id: "@easyblocks/image",
  label: "Easyblocks",
  component: () => mockMediaPicker(fetchImages, "image"),
};

export const easyblocksVideoWidget: Widget = {
  id: "@easyblocks/video",
  label: "Easyblocks",
  component: () => mockMediaPicker(fetchVideos, "video"),
};

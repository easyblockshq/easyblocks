import { mockMediaPicker } from "./mediaPicker";

export {
  easyblocksImageWidget,
  easyblocksVideoWidget,
  fetchEasyblocksMediaResources,
} from "./index.react-server";

export type {
  ImageSrc,
  ImageSrcSetEntry,
  VideoSrc,
} from "./index.react-server";

export const easyblocksImageWidgetComponent = mockMediaPicker("image");

export const easyblocksVideoWidgetComponent = mockMediaPicker("video");

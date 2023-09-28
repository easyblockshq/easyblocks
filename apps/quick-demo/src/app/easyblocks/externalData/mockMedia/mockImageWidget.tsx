import { Widget } from "@easyblocks/core";
import { MediaPicker } from "./MediaPicker";

export const mockImageWidget: Widget = {
  id: "mockImage",
  label: "Library",
  component: ({ id, onChange }) => {
    return <MediaPicker id={id} onChange={onChange} mediaType={"image"} />;
  },
};

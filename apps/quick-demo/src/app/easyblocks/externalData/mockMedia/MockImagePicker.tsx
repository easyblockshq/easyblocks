import type { WidgetComponentProps } from "@easyblocks/core";
import { MediaPicker } from "./MediaPicker";

export function MockImagePicker({
  id,
  onChange,
}: WidgetComponentProps<string>) {
  return <MediaPicker id={id} onChange={onChange} mediaType={"image"} />;
}

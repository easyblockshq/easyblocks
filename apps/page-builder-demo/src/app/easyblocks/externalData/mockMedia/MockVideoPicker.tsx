import type { WidgetComponentProps } from "@easyblocks/core";
import { MediaPicker } from "./MediaPicker";

export function MockVideoPicker({
  id,
  onChange,
}: WidgetComponentProps<string>) {
  return <MediaPicker id={id} onChange={onChange} mediaType={"video"} />;
}

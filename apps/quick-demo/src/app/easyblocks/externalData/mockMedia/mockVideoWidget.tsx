import type { Widget, WidgetComponentProps } from "@easyblocks/core";
import { MediaPicker } from "./MediaPicker";

export const mockVideoWidget: Widget = {
  id: "mockVideo",
  label: "Library",
};

export function MockVideoPicker({
  id,
  onChange,
}: WidgetComponentProps<string>) {
  return <MediaPicker id={id} onChange={onChange} mediaType={"video"} />;
}

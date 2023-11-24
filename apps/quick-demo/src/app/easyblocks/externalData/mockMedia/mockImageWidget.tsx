"use client";
import type { Widget, WidgetComponentProps } from "@easyblocks/core";
import { MediaPicker } from "./MediaPicker";

export const mockImageWidget: Widget = {
  id: "mockImage",
  label: "Library",
};

export function MockImagePicker({ id, onChange }: WidgetComponentProps) {
  return <MediaPicker id={id} onChange={onChange} mediaType={"image"} />;
}

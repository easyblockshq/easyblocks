"use client";
import { Widget } from "@easyblocks/core";
import { MediaPicker } from "./MediaPicker";

export const mockVideoWidget: Widget = {
  id: "mockVideo",
  label: "Library",
  component: ({ id, onChange }) => {
    return <MediaPicker id={id} onChange={onChange} mediaType={"video"} />;
  },
};

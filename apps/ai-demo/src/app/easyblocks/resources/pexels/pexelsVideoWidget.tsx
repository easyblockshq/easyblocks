"use client";
import type { Widget } from "@easyblocks/core";
import { SimplePicker } from "@easyblocks/design-system";

import {
  pexelsApiFetch,
  PEXELS_VIDEO_WIDGET_ID,
} from "@/app/easyblocks/resources/pexels/pexelsShared";

export const pexelsVideoWidget: Widget = {
  id: PEXELS_VIDEO_WIDGET_ID,
  label: "Pexels",
  component: ({ id, onChange }) => {
    return (
      <SimplePicker
        value={id}
        onChange={onChange}
        getItems={async (query) => {
          const response = await pexelsApiFetch(
            query
              ? `/videos/search?query=${query}`
              : // Pexels API returns 400 if no query is provided, so let's use popular videos instead in that case
                "/videos/popular"
          );

          const data = await response.json();

          return data.videos.map((video: any) => {
            return {
              id: video.id.toString(),
              title: video.id.toString(),
              thumbnail: video.image,
            };
          });
        }}
        getItemById={async (id) => {
          const response = await pexelsApiFetch(`/videos/videos/${id}`);

          const video = await response.json();

          return {
            id: video.id.toString(),
            title: video.id.toString(),
            thumbnail: video.image,
          };
        }}
      />
    );
  },
};

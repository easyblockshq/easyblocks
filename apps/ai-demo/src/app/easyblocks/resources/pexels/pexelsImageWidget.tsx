"use client";
import { SimplePicker } from "@easyblocks/design-system";
import type { Widget } from "@easyblocks/core";
import {
  pexelsApiFetch,
  PEXELS_IMAGE_WIDGET_ID,
} from "@/app/easyblocks/resources/pexels/pexelsShared";

export const pexelsImageWidget: Widget = {
  id: PEXELS_IMAGE_WIDGET_ID,
  label: "Pexels",
  component: ({ id, onChange }) => {
    return (
      <SimplePicker
        value={id}
        onChange={onChange}
        getItems={async (query) => {
          const response = await pexelsApiFetch(
            query
              ? `/v1/search?query=${query}`
              : // Pexels API returns 400 if no query is provided, so let's use curated images instead in that case
                "/v1/curated"
          );

          const data = await response.json();

          return data.photos.map((photo: any) => {
            return {
              id: photo.id.toString(),
              title: photo.id.toString(),
              thumbnail: photo.src.small,
            };
          });
        }}
        getItemById={async (id) => {
          const response = await pexelsApiFetch(`/v1/photos/${id}`);

          const photo = await response.json();

          return {
            id: photo.id.toString(),
            title: photo.id.toString(),
            thumbnail: photo.src.small,
          };
        }}
      />
    );
  },
};

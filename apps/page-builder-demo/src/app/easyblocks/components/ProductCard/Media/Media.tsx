import { FC } from "react";

import { ImageProps } from "next/image";
import { Image } from "./Image";
import { MediaObject } from "@/data/shopify/types";

const RATIOS: { [key: string]: number } = {
  landscape1: 0.42,
  landscape2: 0.64,
  landscape3: 0.7,
  landscape4: 0.85,
  square: 1,
  portrait1: 1.1,
  portrait2: 1.32,
};

type MediaRatio =
  | number
  | "landscape1"
  | "landscape2"
  | "landscape3"
  | "landscape4"
  | "square"
  | "portrait1"
  | "portrait2";

interface MediaProps {
  media: MediaObject;
  layout?: "fill" | "responsive";
  objectFit?: "cover" | "contain";
  placeholder?: ImageProps["placeholder"];
  ratio?: MediaRatio;
  place?: boolean;
  sizes?: string;
  isPaused?: boolean;
  priority?: boolean;
  displayOnMQ?: string;
}

export const Media: FC<MediaProps> = ({
  media,
  layout = "responsive",
  objectFit,
  ratio,
  sizes,
  isPaused,
  placeholder,
  priority,
  displayOnMQ,
}) => {
  const { mediaType } = media;

  if (ratio) {
    layout = "fill";
  }

  const mediaElement = (
    <>
      {mediaType === "video" && <div>Video container</div>}
      {mediaType === "image" && (
        <Image
          {...media.mediaObject}
          alt={media.mediaObject.alt ?? ""}
          placeholder={placeholder}
          layout={layout}
          priority={priority}
          objectFit={objectFit}
          sizes={sizes}
        />
      )}
    </>
  );

  if (ratio) {
    if (typeof ratio === "string") {
      ratio = RATIOS[ratio];
    }

    return (
      <div style={{ position: "relative", paddingBottom: ratio * 100 + "%" }}>
        {mediaElement}
      </div>
    );
  }

  return mediaElement;
};

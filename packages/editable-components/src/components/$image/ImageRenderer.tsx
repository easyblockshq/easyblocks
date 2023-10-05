/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

// eslint-disable-next-line no-var, @typescript-eslint/no-unused-vars
declare const createElement: typeof import("react").createElement;

import type { ImageSrc } from "@easyblocks/core";
import type { ComponentType } from "react";
import { Placeholder } from "./Placeholder";

type ImageRendererProps = {
  image: ImageSrc | undefined;
  Image: ComponentType<ImageProps>;
};

function ImageRenderer({ image, Image }: ImageRendererProps) {
  if (!image) {
    return <Placeholder />;
  }

  const { srcset, alt, mimeType } = image;

  if (mimeType === "image/svg+xml") {
    return <StandardImage src={srcset[0].url} alt={alt} mimeType={mimeType} />;
  }

  return <Image src={srcset[0].url} alt={alt} mimeType={mimeType} />;
}

export { ImageRenderer };

interface ImageProps {
  src: string;
  alt: string;
  mimeType: string;
}

function StandardImage({ src, alt }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        display: "block",
        maxWidth: "100%",
        maxHeight: "100%",
        minWidth: "100%",
        minHeight: "100%",
      }}
    />
  );
}

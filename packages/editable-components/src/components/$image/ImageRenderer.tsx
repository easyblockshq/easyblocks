/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

// eslint-disable-next-line no-var, @typescript-eslint/no-unused-vars
declare const createElement: typeof import("react").createElement;

import type { ImageSrc } from "@easyblocks/core";
import type { ResolvedResourceProp } from "@easyblocks/app-utils";
import type { ComponentType } from "react";
import { Placeholder } from "./Placeholder";

type ImageRendererProps = {
  image: ResolvedResourceProp<ImageSrc> | null;
  Image: ComponentType<ImageProps>;
};

function ImageRenderer({ image, Image }: ImageRendererProps) {
  if (!image || image.status === "loading") {
    return <Placeholder />;
  } else if (image.status === "error") {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {image.error.message}
      </div>
    );
  }

  const { srcset, alt, mimeType } = image.value;

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

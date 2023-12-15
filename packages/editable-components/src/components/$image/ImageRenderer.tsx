import React from "react";
import { ImageSrc } from "../../types";
import { Placeholder } from "./Placeholder";

type ImageRendererProps = {
  image: ImageSrc | undefined;
};

function ImageRenderer({ image }: ImageRendererProps) {
  if (!image) {
    return <Placeholder />;
  }

  const { srcset, alt, mimeType } = image;

  return <StandardImage src={srcset[0].url} alt={alt} mimeType={mimeType} />;
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

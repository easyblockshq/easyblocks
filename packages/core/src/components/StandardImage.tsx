import React from "react";

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

export { StandardImage };
export type { ImageProps };

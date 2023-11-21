"use client";
import React from "react";
import NextImage, { ImageLoader, ImageProps } from "next/image";
import { ImageLoaderProps, shopifyImageLoader } from "@/data/shopify/loaders";
import { ImageObject } from "@/data/shopify/types";

export const Image: React.FunctionComponent<ImageProps & ImageObject> = ({
  from,
  layout,
  alt,
  width,
  src,
  height,
  format,
  objectFit,
  sizes,
  priority,
}) => {
  let loader: ImageLoader | undefined;
  switch (from) {
    case "shopify":
      loader = ({ src, width }: ImageLoaderProps) =>
        shopifyImageLoader({ src, width });
      break;
  }
  return (
    <NextImage
      src={src}
      width={layout !== "fill" ? width : undefined}
      height={layout !== "fill" ? height : undefined}
      alt={alt}
      loader={loader}
      layout={layout}
      sizes={sizes}
      objectFit={layout === "fill" ? objectFit ?? "cover" : undefined}
      unoptimized={format === "svg"}
      className={"Image"}
      priority={priority}
    />
  );
};

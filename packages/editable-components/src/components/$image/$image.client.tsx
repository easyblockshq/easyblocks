import React from "react";
import { responsiveValueToSelectivelyDisplayedComponents } from "@easyblocks/app-utils";
import { getAspectRatioClassName, ImageProps } from "./image.helpers";
import { ImageRenderer } from "./ImageRenderer";

export default function ImageClient(props: ImageProps) {
  const {
    image,
    aspectRatio,
    gridBaseLineHeight,
    Wrapper,
    AspectRatioMaker,
    ImageWrapper,
    runtime,
  } = props;
  const { resop, devices, stitches } = runtime;

  const aspectRatioClassName = getAspectRatioClassName(
    image,
    aspectRatio,
    gridBaseLineHeight,
    devices,
    stitches,
    resop
  );

  return (
    <Wrapper.type {...Wrapper.props}>
      <AspectRatioMaker.type
        {...AspectRatioMaker.props}
        className={aspectRatioClassName}
      />

      <ImageWrapper.type {...ImageWrapper.props}>
        {responsiveValueToSelectivelyDisplayedComponents(
          image,
          (image) => {
            return <ImageRenderer image={image} />;
          },
          devices,
          stitches
        )}
      </ImageWrapper.type>
    </Wrapper.type>
  );
}

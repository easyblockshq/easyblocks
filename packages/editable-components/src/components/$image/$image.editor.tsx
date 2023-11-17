import { responsiveValueToSelectivelyDisplayedComponents } from "@easyblocks/app-utils";
import React from "react";
import {
  getAspectRatioClassName,
  getWrapperClassName,
  ImageProps,
} from "./image.helpers";
import { ImageRenderer } from "./ImageRenderer";

export default function ImageEditor(props: ImageProps) {
  const {
    image,
    aspectRatio,
    gridBaseLineHeight,
    Wrapper,
    AspectRatioMaker,
    ImageWrapper,
    runtime: { resop, devices, Image, stitches },
  } = props;

  const aspectRatioClassName = getAspectRatioClassName(
    image,
    aspectRatio,
    gridBaseLineHeight,
    devices,
    stitches,
    resop
  );

  const imageWrapperClassName = getWrapperClassName(devices, stitches);

  return (
    <Wrapper.type {...Wrapper.props}>
      <AspectRatioMaker.type
        {...AspectRatioMaker.props}
        className={aspectRatioClassName}
      />

      <ImageWrapper.type
        {...ImageWrapper.props}
        className={imageWrapperClassName}
      >
        {responsiveValueToSelectivelyDisplayedComponents(
          image,
          (image) => {
            return <ImageRenderer image={image} Image={Image} />;
          },
          devices,
          stitches
        )}
      </ImageWrapper.type>
    </Wrapper.type>
  );
}

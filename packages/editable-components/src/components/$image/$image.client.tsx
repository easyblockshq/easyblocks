/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */

import { responsiveValueToSelectivelyDisplayedComponents } from "@easyblocks/app-utils";
import { getAspectRatioClassName, ImageProps } from "./image.helpers";
import { ImageRenderer } from "./ImageRenderer";

export default function $image(props: ImageProps) {
  const { __fromEditor } = props;
  const { resop, devices, Image, stitches } = __fromEditor.runtime;
  const { image, aspectRatio, gridBaseLineHeight } = __fromEditor.props;

  const { Wrapper, AspectRatioMaker, ImageWrapper } = __fromEditor.components;

  const aspectRatioClassName = getAspectRatioClassName(
    image,
    aspectRatio,
    gridBaseLineHeight,
    devices,
    stitches,
    resop
  );

  return (
    <Wrapper>
      <AspectRatioMaker className={aspectRatioClassName} />

      <ImageWrapper>
        {responsiveValueToSelectivelyDisplayedComponents(
          image,
          (image) => {
            return <ImageRenderer image={image} Image={Image} />;
          },
          devices,
          stitches
        )}
      </ImageWrapper>
    </Wrapper>
  );
}

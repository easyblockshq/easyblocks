/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { responsiveValueToSelectivelyDisplayedComponents } from "@easyblocks/app-utils";
import {
  getAspectRatioClassName,
  getWrapperClassName,
  ImageProps,
} from "./image.helpers";
import { ImageRenderer } from "./ImageRenderer";

export default function $image(props: ImageProps) {
  const { __fromEditor } = props;
  const {
    runtime: { resop, devices, Image, stitches },
  } = __fromEditor;
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

  const imageWrapperClassName = getWrapperClassName(devices, stitches);

  return (
    <Wrapper>
      <AspectRatioMaker className={aspectRatioClassName} />

      <ImageWrapper className={imageWrapperClassName}>
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

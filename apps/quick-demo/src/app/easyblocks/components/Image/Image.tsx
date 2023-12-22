import { ImageSrc } from "@easyblocks/editable-components";
import { ReactElement } from "react";
import { ImageRenderer } from "./ImageRenderer";

type ImageProps = {
  image: ImageSrc | undefined;
  Wrapper: ReactElement;
  AspectRatioMaker: ReactElement;
  NaturalAspectRatioMaker: ReactElement;
  ImageWrapper: ReactElement;
};

export function Image(props: ImageProps) {
  const {
    image,
    Wrapper,
    AspectRatioMaker,
    NaturalAspectRatioMaker,
    ImageWrapper,
  } = props;

  const naturalAspectRatioPaddingBottom = image
    ? `${(1 / image.aspectRatio) * 100}%`
    : "70%";

  return (
    <Wrapper.type {...Wrapper.props}>
      <AspectRatioMaker.type
        {...AspectRatioMaker.props}
        style={{
          display:
            naturalAspectRatioPaddingBottom === undefined ? "block" : undefined,
        }}
      />

      <NaturalAspectRatioMaker.type
        {...NaturalAspectRatioMaker.props}
        style={{
          paddingBottom: naturalAspectRatioPaddingBottom,
        }}
      />

      <ImageWrapper.type {...ImageWrapper.props}>
        <ImageRenderer image={image} />
      </ImageWrapper.type>
    </Wrapper.type>
  );
}

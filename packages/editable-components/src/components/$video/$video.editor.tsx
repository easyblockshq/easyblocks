/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import {
  ResolvedResourceProp,
  responsiveValueToSelectivelyDisplayedComponents,
} from "@easyblocks/app-utils";
import { ResponsiveValue, VideoSrc } from "@easyblocks/core";
import { useForceRerender } from "@easyblocks/utils";
import { useEffect, useState } from "react";
import {
  getAspectRatioClassName,
  getWrapperClassName,
} from "../$image/image.helpers";
import { CompiledShopstoryComponentProps } from "../../types";
import { VideoRenderer } from "./VideoRenderer";

export type VideoProps = CompiledShopstoryComponentProps<
  "$video",
  {
    image: ResponsiveValue<ResolvedResourceProp<VideoSrc>> | null;
    aspectRatio: ResponsiveValue<string>;
    gridBaseLineHeight: ResponsiveValue<string>;
    enablePlaybackControls: boolean;
    enableSoundControls: boolean;
    autoplay: boolean;
  },
  ReturnType<typeof import("./$video.styles")["default"]>
>;

const $video = (props: VideoProps) => {
  const { __fromEditor } = props;

  const { Wrapper, AspectRatioMaker, ImageWrapper } = __fromEditor.components;
  const { image, aspectRatio, gridBaseLineHeight } = __fromEditor.props;
  const { devices, stitches, resop } = __fromEditor.runtime;

  const [isMounted, setMounted] = useState(false);
  const { forceRerender } = useForceRerender();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onResize = () => {
      forceRerender();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

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
          (video) => {
            return <VideoRenderer {...props} video={video} />;
          },
          devices,
          stitches,
          isMounted
        )}
      </ImageWrapper>
    </Wrapper>
  );
};

export default $video;

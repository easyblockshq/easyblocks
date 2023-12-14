import React from "react";
import { responsiveValueToSelectivelyDisplayedComponents } from "@easyblocks/app-utils";
import { ResponsiveValue } from "@easyblocks/core";
import { useForceRerender } from "@easyblocks/utils";
import { useEffect, useState } from "react";
import {
  getAspectRatioClassName,
  getWrapperClassName,
} from "../$image/image.helpers";
import { CompiledNoCodeComponentProps, VideoSrc } from "../../types";
import { VideoRenderer } from "./VideoRenderer";

export type VideoProps = CompiledNoCodeComponentProps<
  "$video",
  {
    image: ResponsiveValue<VideoSrc | undefined>;
    aspectRatio: ResponsiveValue<string>;
    gridBaseLineHeight: ResponsiveValue<string>;
    enablePlaybackControls: boolean;
    enableSoundControls: boolean;
    autoplay: boolean;
  },
  Record<string, any>,
  ReturnType<typeof import("./$video.styles")["default"]>
>;

function VideoEditor(props: VideoProps) {
  const {
    image,
    aspectRatio,
    gridBaseLineHeight,
    Wrapper,
    AspectRatioMaker,
    ImageWrapper,
    runtime: { devices, stitches, resop },
  } = props;

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
          (video) => {
            return <VideoRenderer {...props} video={video} />;
          },
          devices,
          stitches,
          isMounted
        )}
      </ImageWrapper.type>
    </Wrapper.type>
  );
}

export default VideoEditor;

import { responsiveValueToSelectivelyDisplayedComponents } from "@easyblocks/app-utils";
import { useForceRerender } from "@easyblocks/utils";
import React, { useEffect, useState } from "react";
import { getAspectRatioClassName } from "../$image/image.helpers";
import type { VideoProps } from "./$video.editor";
import { VideoRenderer } from "./VideoRenderer";

function VideoClient(props: VideoProps) {
  const {
    image: video,
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
    video,
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
          video,
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

export default VideoClient;

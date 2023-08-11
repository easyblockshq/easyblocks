/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { responsiveValueToSelectivelyDisplayedComponents } from "@easyblocks/app-utils";
import { useForceRerender } from "@easyblocks/utils";
import { useEffect, useState } from "react";
import { getAspectRatioClassName } from "../$image/image.helpers";
import type { VideoProps } from "./$video.editor";
import { VideoRenderer } from "./VideoRenderer";

const $video = (props: VideoProps) => {
  const { __fromEditor } = props;
  const { devices, stitches, resop } = __fromEditor.runtime;
  const { Wrapper, AspectRatioMaker, ImageWrapper } = __fromEditor.components;
  const { image: video, aspectRatio, gridBaseLineHeight } = __fromEditor.props;

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
    <Wrapper>
      <AspectRatioMaker className={aspectRatioClassName} />

      <ImageWrapper>
        {responsiveValueToSelectivelyDisplayedComponents(
          video,
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

/** @jsx globalThis.__SHOPSTORY_REACT_SCOPE__.createElement */
import { ResolvedResourceProp } from "@easyblocks/app-utils";
import { VideoSrc } from "@easyblocks/core";
import { useEffect, useRef, useState } from "react";
import { VideoProps } from "./$video.editor";
import { VideoPlaceholder } from "./VideoPlaceholder";

type VideoRendererProps = VideoProps & {
  video: ResolvedResourceProp<VideoSrc> | null;
};

function VideoRenderer(props: VideoRendererProps) {
  const { __fromEditor, video } = props;
  const isEditing = !!__fromEditor.__editing;

  const {
    ControlsContainer,
    PlayButton,
    PauseButton,
    MuteButton,
    UnmuteButton,
    Video,
  } = __fromEditor.components;

  const { enablePlaybackControls, enableSoundControls } = __fromEditor.props;
  const autoplay = enablePlaybackControls ? __fromEditor.props.autoplay : true;

  const videoRef = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(autoplay);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.muted = muted;
      if (playing) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, [muted, playing]);

  const videoUrl =
    !video || video.status === "loading" || video.status === "error"
      ? null
      : video.value.url;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!videoUrl && <VideoPlaceholder />}
      {videoUrl && (
        <Video
          autoPlay={autoplay}
          muted={true}
          loop={true}
          ref={videoRef}
          playsInline={true}
        >
          <source src={videoUrl} />
          {video?.value?.alt}
        </Video>
      )}

      <ControlsContainer>
        {enableSoundControls && (isEditing || !muted) && (
          <UnmuteButton
            onClick={() => {
              setMuted(true);
            }}
          />
        )}
        {enableSoundControls && (isEditing || muted) && (
          <MuteButton
            onClick={() => {
              setMuted(false);
            }}
          />
        )}
        {enablePlaybackControls && (isEditing || !playing) && (
          <PlayButton
            onClick={() => {
              setPlaying(true);
            }}
          />
        )}
        {enablePlaybackControls && (isEditing || playing) && (
          <PauseButton
            onClick={() => {
              setPlaying(false);
            }}
          />
        )}
      </ControlsContainer>
    </div>
  );
}

export { VideoRenderer };

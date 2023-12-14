import React, { useEffect, useRef, useState } from "react";
import { VideoSrc } from "../../types";
import { VideoProps } from "./$video.editor";
import { VideoPlaceholder } from "./VideoPlaceholder";

type VideoRendererProps = VideoProps & {
  video: VideoSrc | undefined;
};

function VideoRenderer(props: VideoRendererProps) {
  const {
    video,
    enablePlaybackControls,
    enableSoundControls,
    isEditing,
    ControlsContainer,
    PlayButton,
    PauseButton,
    MuteButton,
    UnmuteButton,
    Video,
  } = props;
  const autoplay = enablePlaybackControls ? props.autoplay : true;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(autoplay);

  const videoUrl = !video ? null : video.url;

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

  useEffect(() => {
    videoRef.current?.load();
  }, [videoUrl]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!videoUrl && <VideoPlaceholder />}
      {videoUrl && (
        <Video.type
          {...Video.props}
          autoPlay={autoplay}
          muted={true}
          loop={true}
          ref={videoRef}
          playsInline={true}
        >
          <source src={videoUrl} />
          {video?.alt}
        </Video.type>
      )}

      <ControlsContainer.type {...ControlsContainer.props}>
        {enableSoundControls && (isEditing || !muted) && (
          <UnmuteButton.type
            {...UnmuteButton.props}
            onClick={() => {
              setMuted(true);
            }}
          />
        )}
        {enableSoundControls && (isEditing || muted) && (
          <MuteButton.type
            {...MuteButton.props}
            onClick={() => {
              setMuted(false);
            }}
          />
        )}
        {enablePlaybackControls && (isEditing || !playing) && (
          <PlayButton.type
            {...PlayButton.props}
            onClick={() => {
              setPlaying(true);
            }}
          />
        )}
        {enablePlaybackControls && (isEditing || playing) && (
          <PauseButton.type
            {...PauseButton.props}
            onClick={() => {
              setPlaying(false);
            }}
          />
        )}
      </ControlsContainer.type>
    </div>
  );
}

export { VideoRenderer };

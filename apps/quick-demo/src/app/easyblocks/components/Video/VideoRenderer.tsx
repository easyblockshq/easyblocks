import { useEffect, useRef, useState } from "react";
import { VideoSrc } from "../../externalData/types";
import { VideoProps } from "./Video";

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

function VideoPlaceholder() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#5B5B5B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="276"
        height="200"
        viewBox="0 0 276 200"
        fill="none"
        style={{
          width: "45%",
          height: "50%",
          display: "block",
          color: "#747474",
          opacity: 0.5,
        }}
      >
        <path
          d="M188 0C191.315 0 194.495 1.31696 196.839 3.66117C199.183 6.00537 200.5 9.1848 200.5 12.5V65L265.663 19.375C266.599 18.7182 267.699 18.3312 268.841 18.2563C269.982 18.1813 271.123 18.4212 272.138 18.9499C273.152 19.4786 274.003 20.2757 274.596 21.2544C275.188 22.2331 275.501 23.3557 275.5 24.5V175.5C275.501 176.644 275.188 177.767 274.596 178.746C274.003 179.724 273.152 180.521 272.138 181.05C271.123 181.579 269.982 181.819 268.841 181.744C267.699 181.669 266.599 181.282 265.663 180.625L200.5 135V187.5C200.5 190.815 199.183 193.995 196.839 196.339C194.495 198.683 191.315 200 188 200H13C9.68479 200 6.50537 198.683 4.16117 196.339C1.81696 193.995 0.5 190.815 0.5 187.5V12.5C0.5 9.1848 1.81696 6.00537 4.16117 3.66117C6.50537 1.31696 9.68479 0 13 0H188ZM175.5 25H25.5V175H175.5V25ZM80.5 60.3625C81.4513 60.3599 82.3836 60.6288 83.1875 61.1375L137.625 95.7875C138.332 96.2396 138.914 96.8625 139.317 97.5987C139.72 98.3349 139.932 99.1607 139.932 100C139.932 100.839 139.72 101.665 139.317 102.401C138.914 103.138 138.332 103.76 137.625 104.212L83.1875 138.875C82.4293 139.358 81.5548 139.628 80.656 139.656C79.7573 139.684 78.8676 139.47 78.0807 139.035C77.2938 138.6 76.6388 137.96 76.1846 137.184C75.7304 136.408 75.4939 135.524 75.5 134.625V65.375C75.5 62.6125 77.75 60.3625 80.5 60.3625ZM250.5 60.5L200.5 95.5V104.475L250.5 139.475V60.5Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { imageStyles } from "../Image/Image.styles";

export default function styles(
  input: NoCodeComponentStylesFunctionInput
): NoCodeComponentStylesFunctionResult {
  const imageBoxes = imageStyles(input);
  const { values } = input;

  let positions: [string, string];
  if (values.controlsPosition === "top-left") {
    positions = ["top", "left"];
  } else if (values.controlsPosition === "top-right") {
    positions = ["top", "right"];
  } else if (values.controlsPosition === "bottom-left") {
    positions = ["bottom", "left"];
  } else if (values.controlsPosition === "bottom-right") {
    positions = ["bottom", "right"];
  } else {
    throw new Error("unreachable");
  }

  const ControlsContainer = {
    display:
      values.enablePlaybackControls || values.enableSoundControls
        ? "flex"
        : "none",
    position: "absolute",
    [positions[0]]: values.margin,
    [positions[1]]: values.margin,
    right: values.margin,
    flexDirection: "row",
    gap: values.gap,
    pointerEvents: "auto", // let's enable clickability
  };

  const ImageWrapper = {
    ...(imageBoxes.styled!.ImageWrapper as Record<string, unknown>),
  };

  return {
    ...imageBoxes,
    styled: {
      ...imageBoxes.styled,
      ImageWrapper,
      ControlsContainer,
      Video: {
        __as: "video",
        objectFit: "cover",
        objectPosition: "center center",
        width: "100%",
        height: "100%",
        position: "relative",
      },
    },
    components: {
      ...imageBoxes.components,
      PlayButton: {
        noAction: true,
      },
      PauseButton: {
        noAction: true,
      },
      MuteButton: {
        noAction: true,
      },
      UnmuteButton: {
        noAction: true,
      },
    },
  };
}

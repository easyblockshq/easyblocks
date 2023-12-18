import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";

export default function styles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  return {
    styled: {
      Wrapper: {
        position: "relative",
      },
      ImageWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transition: "opacity .15s",
        "& img": {
          objectFit: "cover",
        },
      },
      AspectRatioMaker: {
        // this component does the size. If parent forces element to go bigger, it's gonna break aspect ratio. But in most cases it won't.
        position: "relative",
      },
    },
    props: {
      aspectRatio: params.passedAspectRatio ?? values.aspectRatio,
    },
  };
}

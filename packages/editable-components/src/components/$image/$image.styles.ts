import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";

export default function styles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput) {
  return {
    Wrapper: box({
      position: "relative",
    }),
    ImageWrapper: box({
      __action: "action",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transition: "opacity .15s",
      "& img": {
        objectFit: "cover",
      },
    }),
    AspectRatioMaker: box({
      // this component does the size. If parent forces element to go bigger, it's gonna break aspect ratio. But in most cases it won't.
      position: "relative",
    }),
    __props: {
      aspectRatio: params.passedAspectRatio ?? values.aspectRatio,
    },
  };
}

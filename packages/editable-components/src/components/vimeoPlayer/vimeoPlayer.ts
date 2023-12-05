import vimeoStyles, { VimeoPlayerValues } from "./vimeoPlayer.styles";
import { NoCodeComponentDefinition } from "@easyblocks/core";

const vimeoPlayerEditableComponent: NoCodeComponentDefinition<VimeoPlayerValues> =
  {
    id: "$vimeoPlayer",
    label: "Vimeo Player",
    thumbnail:
      "https://shopstory.s3.eu-central-1.amazonaws.com/picker_vimeo.png",
    schema: [
      {
        prop: "videoId",
        type: "string",
        label: "Video ID",
      },
      {
        prop: "aspectRatio",
        label: "Aspect Ratio",
        type: "stringToken",
        params: { tokenId: "aspectRatios" },
      },
      {
        prop: "isAutoPlay",
        type: "boolean",
        defaultValue: true,
        label: "Auto play",
      },
      {
        prop: "isMuted",
        type: "boolean",
        defaultValue: true,
        label: "Muted",
      },
      {
        prop: "isLoop",
        type: "boolean",
        defaultValue: true,
        label: "Loop",
      },
      {
        prop: "areControlsDisabled",
        type: "boolean",
        label: "Hide controls",
      },
    ],
    styles: vimeoStyles,
  };

export { vimeoPlayerEditableComponent };

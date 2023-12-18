import { InternalRenderableComponentDefinition } from "@easyblocks/core/_internals";
import { last } from "@easyblocks/utils";
import { VideoSrc } from "../../types";
import videoStyles from "./$video.styles";

const VIDEO_THUMBNAIL_URL =
  "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_video.png";

const videoComponentDefinition: InternalRenderableComponentDefinition<"$video"> =
  {
    id: "$video",
    label: "Video",
    thumbnail: VIDEO_THUMBNAIL_URL,
    type: "item",
    styles: videoStyles,
    editing: ({ params, editingInfo }) => {
      let fields = [...editingInfo.fields];

      // If aspect ratio passed from external, we don't need it.
      if (params.noAspectRatio) {
        fields = fields.filter((field) => field.path !== "aspectRatio");
      }

      return {
        fields,
      };
    },
    schema: [
      {
        prop: "image",
        label: "Video",
        type: "@easyblocks/video",
        responsive: true,
        optional: true,
      },
      {
        prop: "aspectRatio", // main image size
        label: "Aspect Ratio",
        type: "stringToken",
        params: {
          tokenId: "aspectRatios",
        },
        buildOnly: true,
      },
      {
        prop: "enablePlaybackControls",
        label: "Enable play/pause",
        type: "boolean",
        group: "Playback control",
      },

      {
        prop: "PlayButton",
        label: "Play Button",
        type: "component",
        required: true,
        accepts: ["button"],
        group: "Playback control",
        // visible: (values) => {
        //   return values.enablePlaybackControls;
        // },
      },
      {
        prop: "PauseButton",
        label: "Pause Button",
        type: "component",
        required: true,
        accepts: ["button"],
        group: "Playback control",
        // visible: (values) => {
        //   return values.enablePlaybackControls;
        // },
      },
      {
        prop: "autoplay",
        label: "Autoplay",
        type: "boolean",
        defaultValue: true,
        group: "Playback control",
        visible: (values) => {
          return values.enablePlaybackControls;
        },
      },

      {
        prop: "enableSoundControls",
        label: "Enable sound controls",
        type: "boolean",
        group: "Sound control",
      },
      {
        prop: "MuteButton",
        label: "Mute Button",
        type: "component",
        required: true,
        accepts: ["button"],
        group: "Sound control",
        // visible: (values) => {
        //   return values.enableSoundControls;
        // },
      },
      {
        prop: "UnmuteButton",
        label: "Unmute Button",
        type: "component",
        required: true,
        accepts: ["button"],
        group: "Sound control",
        // visible: (values) => {
        //   return values.enableSoundControls;
        // },
      },

      {
        prop: "controlsPosition",
        label: "Position",
        type: "select",
        responsive: true,
        params: {
          options: [
            { value: "top-left", label: "Top left" },
            { value: "top-right", label: "Top right" },
            { value: "bottom-left", label: "Bottom left" },
            { value: "bottom-right", label: "Bottom right" },
          ],
        },
        visible: (values) => {
          return values.enablePlaybackControls;
        },
        group: "Controls styling",
      },
      {
        prop: "margin",
        label: "Margin",
        type: "space",
        visible: (values) => {
          return values.enablePlaybackControls;
        },
        group: "Controls styling",
      },
      {
        prop: "gap",
        label: "Gap",
        type: "space",
        visible: (values) => {
          return values.enablePlaybackControls;
        },
        group: "Controls styling",
      },
    ],
    preview: ({ values }) => {
      const activeVideoValue = values.image as VideoSrc | undefined;

      if (!activeVideoValue) {
        return {
          description: "None",
        };
      }

      const videoFileName = last(activeVideoValue.url.split("/"));
      const videoFileNameWithoutQueryParams = videoFileName.split("?")[0];

      return {
        description: videoFileNameWithoutQueryParams,
      };
    },
  };

export { videoComponentDefinition };

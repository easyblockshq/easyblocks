import {
  ExternalReference,
  NoCodeComponentDefinition,
  getExternalReferenceLocationKey,
  getExternalValue,
  isCompoundExternalDataValue,
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueForceGet,
} from "@easyblocks/core";
import { VideoSrc } from "@easyblocks/editable-components";
import { assertDefined, last } from "@easyblocks/utils";
import videoStyles from "./Video.styles";

const VIDEO_THUMBNAIL_URL =
  "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_video.png";

const videoComponentDefinition: NoCodeComponentDefinition = {
  id: "Video",
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
  getEditorSidebarPreview: (
    config,
    externalData,
    { breakpointIndex, devices }
  ) => {
    const device = responsiveValueFindDeviceWithDefinedValue(
      config.image,
      breakpointIndex,
      devices
    );

    if (!device) {
      return {
        description: "None",
      };
    }

    const activeVideoValue = responsiveValueForceGet<ExternalReference>(
      config.image,
      device.id
    );

    if (activeVideoValue.id == null) {
      return {
        description: "None",
      };
    }

    const videoExternalValue =
      externalData[
        getExternalReferenceLocationKey(
          assertDefined(config._id),
          "image",
          breakpointIndex
        )
      ];

    if (!videoExternalValue || "error" in videoExternalValue) {
      return {
        description: "None",
      };
    }

    if (isCompoundExternalDataValue(videoExternalValue)) {
      if (!activeVideoValue.key) {
        return {
          description: "None",
        };
      }

      const resolvedCompoundExternalDataResult =
        videoExternalValue.value[activeVideoValue.key];

      if (!resolvedCompoundExternalDataResult) {
        return {
          description: "None",
        };
      }

      const imageFileName = last(
        (resolvedCompoundExternalDataResult.value as VideoSrc).url.split("/")
      );
      const imageFileNameWithoutQueryParams = imageFileName.split("?")[0];

      return {
        description: imageFileNameWithoutQueryParams,
      };
    }

    const videoResourceValue = getExternalValue(videoExternalValue) as VideoSrc;
    const videoFileName = last(videoResourceValue.url.split("/"));
    const videoFileNameWithoutQueryParams = videoFileName.split("?")[0];

    return {
      description: videoFileNameWithoutQueryParams,
    };
  },
};

export { videoComponentDefinition };

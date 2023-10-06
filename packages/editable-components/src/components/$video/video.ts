import {
  InternalRenderableComponentDefinition,
  isCompoundExternalDataValue,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import {
  getResourceId,
  getResourceValue,
  UnresolvedResource,
  VideoSrc,
} from "@easyblocks/core";
import { assertDefined, last } from "@easyblocks/utils";
import videoStyles from "./$video.styles";

const videoComponentDefinition: InternalRenderableComponentDefinition<"$video"> =
  {
    id: "$video",
    label: "Video",
    thumbnail:
      "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_video.png",
    type: ["image", "item"],
    styles: videoStyles,
    editing: ({ values, editingInfo }) => {
      let fields = [...editingInfo.fields];

      // If aspect ratio passed from external, we don't need it.
      if (values.noAspectRatio) {
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
        type: "resource",
        resourceType: "video",
      },
      {
        prop: "aspectRatio", // main image size
        label: "Aspect Ratio",
        type: "stringToken",
        tokenId: "aspectRatios",
        extraValues: ["grid-baseline"],
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
        componentTypes: ["button"],
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
        componentTypes: ["button"],
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
        componentTypes: ["button"],
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
        componentTypes: ["button"],
        group: "Sound control",
        // visible: (values) => {
        //   return values.enableSoundControls;
        // },
      },

      {
        prop: "controlsPosition",
        label: "Position",
        type: "select$",
        options: [
          { value: "top-left", label: "Top left" },
          { value: "top-right", label: "Top right" },
          { value: "bottom-left", label: "Bottom left" },
          { value: "bottom-right", label: "Bottom right" },
        ],
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
    getEditorSidebarPreview: (config, externalData, options) => {
      const { breakpointIndex } = options;
      const activeVideoValue = responsiveValueForceGet<UnresolvedResource>(
        config.image,
        breakpointIndex
      );

      if (activeVideoValue.id == null) {
        return {
          type: "icon",
          icon: "link",
          description: "None",
        };
      }

      const videoResource =
        externalData[
          getResourceId(assertDefined(config._id), `image`, breakpointIndex)
        ];

      if (!videoResource || "error" in videoResource) {
        return {
          type: "icon",
          icon: "link",
          description: "None",
        };
      }

      if (isCompoundExternalDataValue(videoResource)) {
        if (!activeVideoValue.key) {
          return {
            type: "icon",
            icon: "link",
            description: "None",
          };
        }

        const resolvedCompoundResourceResult =
          videoResource.value[activeVideoValue.key];

        if (!resolvedCompoundResourceResult) {
          return {
            type: "icon",
            icon: "link",
            description: "None",
          };
        }

        const imageFileName = last(
          (resolvedCompoundResourceResult.value as VideoSrc).url.split("/")
        );
        const imageFileNameWithoutQueryParams = imageFileName.split("?")[0];

        return {
          type: "image",
          url: (resolvedCompoundResourceResult.value as VideoSrc).url,
          description: imageFileNameWithoutQueryParams,
        };
      }

      const videoResourceValue = getResourceValue(videoResource) as VideoSrc;
      const videoFileName = last(videoResourceValue.url.split("/"));
      const videoFileNameWithoutQueryParams = videoFileName.split("?")[0];

      return {
        type: "icon",
        icon: "link",
        description: videoFileNameWithoutQueryParams,
      };
    },
  };

export { videoComponentDefinition };

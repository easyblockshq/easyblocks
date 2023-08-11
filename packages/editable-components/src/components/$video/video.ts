import {
  findComponentDefinition,
  getSchemaPropByProp,
  InternalRenderableComponentDefinition,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import {
  getResourceFetchParams,
  getResourceTransformerHash,
  getResourceType,
  getResourceValue,
  getResourceVariant,
  Resource,
  resourceByIdentity,
  ResourceSchemaProp,
  UnresolvedResource,
  VideoSrc,
} from "@easyblocks/core";
import { last } from "@easyblocks/utils";
import videoStyles from "./$video.styles";

const videoComponentDefinition: InternalRenderableComponentDefinition<"$video"> =
  {
    id: "$video",
    label: "Video",
    tags: ["image", "item"],
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
        type: "video",
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
        visible: (values) => {
          return values.enablePlaybackControls;
        },
      },
      {
        prop: "PauseButton",
        label: "Pause Button",
        type: "component",
        required: true,
        componentTypes: ["button"],
        group: "Playback control",
        visible: (values) => {
          return values.enablePlaybackControls;
        },
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
        visible: (values) => {
          return values.enableSoundControls;
        },
      },
      {
        prop: "UnmuteButton",
        label: "Unmute Button",
        type: "component",
        required: true,
        componentTypes: ["button"],
        group: "Sound control",
        visible: (values) => {
          return values.enableSoundControls;
        },
      },

      {
        prop: "controlsPosition",
        label: "Controls position",
        type: "select$",
        options: ["top-left", "top-right", "bottom-left", "bottom-right"],
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
    getEditorSidebarPreview: (config, options) => {
      const {
        breakpointIndex,
        resources,
        video,
        videoVariants,
        image,
        imageVariants,
      } = options;
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

      const schemaProp = getSchemaPropByProp(
        // @ts-expect-error For now lets leave it, we will fix it later!
        findComponentDefinition(config, options)!,
        "image"
      ) as ResourceSchemaProp;

      const videoResource = resources.find<Resource<VideoSrc>>(
        (resource): resource is Resource<VideoSrc> => {
          const resourceType = getResourceType(
            schemaProp,
            options,
            activeVideoValue
          );

          const fetchParams = getResourceFetchParams(
            activeVideoValue,
            schemaProp,
            { image, imageVariants, video, videoVariants }
          );

          return resourceByIdentity(
            activeVideoValue.id,
            resourceType,
            activeVideoValue.info,
            fetchParams
          )(resource);
        }
      );

      if (!videoResource || videoResource.status !== "success") {
        return {
          type: "icon",
          icon: "link",
          description: "None",
        };
      }

      const transformHash = getResourceTransformerHash(
        videoResource,
        schemaProp,
        getResourceVariant(activeVideoValue, schemaProp, {
          image,
          imageVariants,
          video,
          videoVariants,
        })
      );

      const videoResourceValue = getResourceValue(videoResource, transformHash);
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

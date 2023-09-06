import {
  buttonActionSchemaProp,
  InternalRenderableComponentDefinition,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import {
  FetchCompoundResourceResultValues,
  getResourceValue,
  ImageSrc,
  ResolvedResource,
  UnresolvedResource,
} from "@easyblocks/core";
import { last } from "@easyblocks/utils";
import imageStyles from "./$image.styles";

const imageComponentDefinition: InternalRenderableComponentDefinition<"$image"> =
  {
    id: "$image",
    label: "Image",
    tags: ["image", "item"],
    styles: imageStyles,
    editing: ({ values, editingInfo }) => {
      let fields = [...editingInfo.fields];

      // If aspect ratio passed from external, we don't need it.
      if (values.noAspectRatio) {
        fields = fields.filter((field) => field.path !== "aspectRatio");
      }

      if (values.noAction) {
        fields = fields.filter((field) => field.path !== "action");
      }

      return {
        fields,
      };
    },
    schema: [
      {
        prop: "image",
        type: "resource",
        resourceType: "image",
        label: "Source",
      },
      {
        prop: "aspectRatio", // main image size
        label: "Aspect Ratio",
        type: "stringToken",
        tokenId: "aspectRatios",
        extraValues: ["grid-baseline", "natural"],
      },
      buttonActionSchemaProp,
    ],
    getEditorSidebarPreview(config, options) {
      const { breakpointIndex, resources } = options;

      const activeImageValue = responsiveValueForceGet<UnresolvedResource>(
        config.image,
        breakpointIndex
      );

      if (activeImageValue.id == null) {
        return {
          type: "icon",
          icon: "link",
          description: "None",
        };
      }

      const imageResource = resources.find((resource) => {
        return resource.id === `${config._id}.image`;
      });

      if (!imageResource || imageResource.status !== "success") {
        return {
          type: "icon",
          icon: "link",
          description: "None",
        };
      }

      if (imageResource.type === "object") {
        if (!activeImageValue.key) {
          return {
            type: "icon",
            icon: "link",
            description: "None",
          };
        }

        const resolvedCompoundResourceResult = (
          imageResource as ResolvedResource<FetchCompoundResourceResultValues>
        ).value?.[activeImageValue.key];

        if (!resolvedCompoundResourceResult) {
          return {
            type: "icon",
            icon: "link",
            description: "None",
          };
        }

        const imageFileName = last(
          (resolvedCompoundResourceResult.value as ImageSrc).url.split("/")
        );
        const imageFileNameWithoutQueryParams = imageFileName.split("?")[0];

        return {
          type: "image",
          url: (resolvedCompoundResourceResult.value as ImageSrc).url,
          description: imageFileNameWithoutQueryParams,
        };
      }

      const imageResourceValue = getResourceValue(imageResource);
      const imageFileName = last(imageResourceValue.url.split("/"));
      const imageFileNameWithoutQueryParams = imageFileName.split("?")[0];

      return {
        type: "image",
        url: imageResourceValue.url,
        description: imageFileNameWithoutQueryParams,
      };
    },
  };

export { imageComponentDefinition };

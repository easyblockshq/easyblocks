import {
  buttonActionSchemaProp,
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
  ImageSrc,
  Resource,
  resourceByIdentity,
  ResourceSchemaProp,
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
        type: "image",
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
      const {
        breakpointIndex,
        resources,
        imageVariants,
        image,
        videoVariants,
        video,
      } = options;

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

      const schemaProp = getSchemaPropByProp(
        // @ts-expect-error For now lets leave it, we will fix it later!
        findComponentDefinition(config, options)!,
        "image"
      ) as ResourceSchemaProp;

      const imageResource = resources.find<Resource<ImageSrc>>(
        (resource): resource is Resource<ImageSrc> => {
          const resourceType = getResourceType(
            schemaProp,
            options,
            activeImageValue
          );

          const fetchParams = getResourceFetchParams(
            activeImageValue,
            schemaProp,
            { image, imageVariants, video, videoVariants }
          );

          return resourceByIdentity(
            activeImageValue.id,
            resourceType,
            activeImageValue.info,
            fetchParams
          )(resource);
        }
      );

      if (!imageResource || imageResource.status !== "success") {
        return {
          type: "icon",
          icon: "link",
          description: "None",
        };
      }

      const transformHash = getResourceTransformerHash(
        imageResource,
        schemaProp,
        getResourceVariant(activeImageValue, schemaProp, {
          image,
          imageVariants,
          video,
          videoVariants,
        })
      );
      const imageResourceValue = getResourceValue(imageResource, transformHash);
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

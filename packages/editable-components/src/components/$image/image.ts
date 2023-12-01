import { isCompoundExternalDataValue } from "@easyblocks/app-utils";
import {
  ExternalReference,
  ImageSrc,
  getExternalReferenceLocationKey,
  getExternalValue,
  responsiveValueFindDeviceWithDefinedValue,
  responsiveValueForceGet,
} from "@easyblocks/core";
import {
  InternalRenderableComponentDefinition,
  buttonActionSchemaProp,
} from "@easyblocks/core/_internals";
import { assertDefined, last } from "@easyblocks/utils";
import imageStyles from "./$image.styles";

const imageComponentDefinition: InternalRenderableComponentDefinition<"$image"> =
  {
    id: "$image",
    label: "Image",
    type: "item",
    thumbnail:
      "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_image.png",
    styles: imageStyles,
    editing: ({ params, editingInfo }) => {
      let fields = [...editingInfo.fields];

      // If aspect ratio passed from external, we don't need it.
      if (params.noAspectRatio) {
        fields = fields.filter((field) => field.path !== "aspectRatio");
      }

      if (params.noAction) {
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
        responsive: true,
        optional: true,
      },
      {
        prop: "aspectRatio", // main image size
        label: "Aspect Ratio",
        type: "stringToken",
        params: {
          tokenId: "aspectRatios",
          extraValues: ["natural"],
        },
        buildOnly: true,
      },
      buttonActionSchemaProp,
    ],
    getEditorSidebarPreview(
      config,
      externalData,
      { breakpointIndex, devices }
    ) {
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

      const activeImageValue = responsiveValueForceGet<ExternalReference>(
        config.image,
        device.id
      );

      if (activeImageValue.id === null) {
        return {
          description: "None",
        };
      }

      const imageExternalValue =
        externalData[
          getExternalReferenceLocationKey(
            assertDefined(config._id),
            "image",
            device.id
          )
        ];

      if (!imageExternalValue || "error" in imageExternalValue) {
        return {
          description: "None",
        };
      }

      if (isCompoundExternalDataValue(imageExternalValue)) {
        if (!activeImageValue.key) {
          return {
            description: "None",
          };
        }

        const resolvedCompoundExternalValueResult =
          imageExternalValue.value[activeImageValue.key];

        if (!resolvedCompoundExternalValueResult) {
          return {
            description: "None",
          };
        }

        const imageFileName = last(
          (resolvedCompoundExternalValueResult.value as ImageSrc).url.split("/")
        );
        const imageFileNameWithoutQueryParams = imageFileName.split("?")[0];

        return {
          thumbnail: {
            type: "image",
            src: (resolvedCompoundExternalValueResult.value as ImageSrc).url,
          },
          description: imageFileNameWithoutQueryParams,
        };
      }

      const imageResourceValue = getExternalValue(
        imageExternalValue
      ) as ImageSrc;
      const imageFileName = last(imageResourceValue.url.split("/"));
      const imageFileNameWithoutQueryParams = imageFileName.split("?")[0];

      return {
        thumbnail: {
          type: "image",
          src: imageResourceValue.url,
        },
        description: imageFileNameWithoutQueryParams,
      };
    },
  };

export { imageComponentDefinition };

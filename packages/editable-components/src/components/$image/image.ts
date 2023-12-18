import {
  InternalRenderableComponentDefinition,
  buttonActionSchemaProp,
} from "@easyblocks/core/_internals";
import { last } from "@easyblocks/utils";
import { ImageSrc } from "../../types";
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
        type: "@easyblocks/image",
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
    preview({ values }) {
      const activeImageValue = values.image as ImageSrc | undefined;

      if (!activeImageValue) {
        return {
          description: "None",
        };
      }

      const imageFileName = last(activeImageValue.url.split("/"));
      const imageFileNameWithoutQueryParams = imageFileName.split("?")[0];

      return {
        thumbnail: {
          type: "image",
          src: activeImageValue.url,
        },
        description: imageFileNameWithoutQueryParams,
      };
    },
  };

export { imageComponentDefinition };

import { NoCodeComponentDefinition } from "@easyblocks/core";
import { last } from "@easyblocks/utils";
import { imageStyles } from "./Image.styles";
import { ImageSrc } from "../../externalData/types";

const imageComponentDefinition: NoCodeComponentDefinition = {
  id: "Image",
  label: "Image",
  type: "item",
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_image.png",
  styles: imageStyles,
  editing: ({ params, editingInfo }) => {
    let fields = [...editingInfo.fields];

    // If aspectRatio is passed from a parent component, we don't display it
    if (params.aspectRatio) {
      fields = fields.filter((field) => field.path !== "aspectRatio");
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

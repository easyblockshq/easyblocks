import { NoCodeComponentDefinition, box, SchemaProp } from "@easyblocks/core";
import {
  normalizePxValue,
  paddingSchemaProp,
  borderSchemaProp,
  toStartEnd,
} from "@/app/easyblocks/noCodeComponents/utils";

export const coverCardDefinition: NoCodeComponentDefinition = {
  id: "CoverCard",
  label: "Cover Card",
  schema: [
    // {
    //   prop: "Image",
    //   type: "component",
    //   accepts: ["$image"],
    //   required: true,
    //   visible: true
    // },
    {
      prop: "image",
      type: "image",
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
      defaultValue: { value: "natural" },
    },

    // paddingSchemaProp("paddingLeft"),
    // paddingSchemaProp("paddingRight"),
    // paddingSchemaProp("paddingTop"),
    // paddingSchemaProp("paddingBottom"),
    // paddingSchemaProp("paddingInternal"),
    {
      prop: "enableBorder",
      type: "boolean",
      responsive: true,
    },
    {
      prop: "borderColor",
      type: "color",
      responsive: true,
    },
    borderSchemaProp("borderLeft"),
    borderSchemaProp("borderRight"),
    borderSchemaProp("borderTop"),
    borderSchemaProp("borderBottom"),
    {
      prop: "cornerRadius",
      type: "string",
      responsive: true,
      params: {
        normalize: normalizePxValue(0, 32),
      },
      defaultValue: "0",
    },
  ],
  // editing: ({ editingInfo }) => {
  //   return {
  //     ...editingInfo,
  //     components: {
  //       Image: {
  //         selectable: false,
  //       },
  //     },
  //   };
  // },
  styles: (values: any) => {
    let {
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      enableBorder,
      borderLeft,
      borderRight,
      borderTop,
      borderBottom,
      borderColor,
    } = values;

    const aspectRatio =
      values.aspectRatio === "natural"
        ? null
        : values.aspectRatio.replace(":", " / ");

    return {
      Root: box({
        display: "grid",
        overflow: "hidden",
        position: "relative",
        background: "black",

        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,

        borderLeft: enableBorder
          ? `${borderLeft}px solid ${borderColor}`
          : "none",
        borderRight: enableBorder
          ? `${borderRight}px solid ${borderColor}`
          : "none",
        borderTop: enableBorder
          ? `${borderTop}px solid ${borderColor}`
          : "none",
        borderBottom: enableBorder
          ? `${borderBottom}px solid ${borderColor}`
          : "none",
        borderRadius: `${values.cornerRadius}px`,
      }),
      Placeholder: box({
        aspectRatio: aspectRatio ?? "1 / 1",
      }),
      Image: box({
        __as: "img",
        aspectRatio: aspectRatio ?? "initial",
        objectFit: "cover",
        alignSelf: "stretch",
        justifySelf: "stretch",
      }),
    };
  },
};

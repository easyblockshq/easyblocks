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
    {
      prop: "Background",
      type: "component",
      accepts: ["Image", "Video", "VimeoPlayer"],
      required: true,
      visible: true,
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
    {
      prop: "overlayOpacity",
      type: "select",
      responsive: true,
      params: {
        options: [
          "0",
          "0.05",
          "0.1",
          "0.15",
          "0.2",
          "0.25",
          "0.3",
          "0.35",
          "0.4",
          "0.45",
          "0.5",
        ],
      },
      defaultValue: "0",
    },
  ],
  editing: ({ editingInfo }) => {
    return {
      ...editingInfo,
      components: {
        Background: {
          selectable: false,
        },
      },
    };
  },
  styles: ({ values }) => {
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
      overlayOpacity,
    } = values;

    const aspectRatio =
      values.aspectRatio === "natural"
        ? null
        : values.aspectRatio.replace(":", " / ");

    return {
      styled: {
        Root: {
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
        },
        Placeholder: {
          aspectRatio: aspectRatio ?? "1 / 1",
        },
        // Image: {
        //   __as: "img",
        //   aspectRatio: aspectRatio ?? "initial",
        //   objectFit: "cover",
        //   alignSelf: "stretch",
        //   justifySelf: "stretch",
        // },
        Overlay: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: overlayOpacity,
          backgroundColor: "black",
          pointerEvents: "none",
        },
      },
    };
  },
};

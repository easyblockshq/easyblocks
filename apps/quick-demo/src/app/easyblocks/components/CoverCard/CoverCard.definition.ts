import { NoCodeComponentDefinition } from "@easyblocks/core";
import { pxValueNormalize } from "../utils/pxValueNormalize";
import {
  borderSchemaProps,
  bordersEditing,
  bordersStyles,
} from "@/app/easyblocks/components/utils/borders";
import {
  cornerSchemaProps,
  cornerStyles,
} from "@/app/easyblocks/components/utils/corners";

export const coverCardDefinition: NoCodeComponentDefinition = {
  id: "CoverCard",
  label: "Cover Card",
  type: "card",
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
    ...borderSchemaProps,
    ...cornerSchemaProps,
    {
      prop: "overlayOpacity",
      type: "select",
      group: "Overlay",
      label: "Opacity",
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
  styles: ({ values }) => {
    let {
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      overlayOpacity,
    } = values;

    return {
      components: {
        Background: {
          aspectRatio: values.aspectRatio,
        },
      },
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

          ...bordersStyles(values),
          ...cornerStyles(values),
        },
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
  editing: ({ editingInfo, values }) => {
    bordersEditing(editingInfo, values);

    return {
      ...editingInfo,
      components: {
        Background: {
          selectable: false,
        },
      },
    };
  },
};

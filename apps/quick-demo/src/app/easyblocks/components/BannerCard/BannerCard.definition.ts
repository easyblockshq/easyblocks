import { NoCodeComponentDefinition, box, SchemaProp } from "@easyblocks/core";
import {
  snapToEdgeSchemaProp,
  paddingSchemaProp,
  borderSchemaProp,
} from "../utils/schemaProps";

import { pxValueNormalize } from "@/app/easyblocks/components/utils/pxValueNormalize";
import { toStartEnd } from "@/app/easyblocks/components/utils/stylesHelpers";

function noFillPaddingSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "space",
    defaultValue: {
      ref: "0",
      value: "0px",
    },
  };
}

export const bannerCardDefinition: NoCodeComponentDefinition = {
  id: "BannerCard",
  label: "Banner Card",
  type: "card",
  schema: [
    {
      prop: "coverPosition",
      label: "Cover position",
      type: "select",
      responsive: true,
      params: {
        options: [
          "hide",
          "left-stretch",
          "left-start",
          "left-center",
          "left-end",
          "right-stretch",
          "right-start",
          "right-center",
          "right-end",
          "top",
          "bottom",
          "background",
        ],
      },
    },
    {
      prop: "stackPosition",
      label: "Stack position",
      type: "position",
      responsive: true,
    },
    {
      prop: "coverWidth",
      type: "select",
      responsive: true,
      params: {
        options: ["25%", "33%", "40%", "50%", "60%", "66%", "75%"],
      },
      defaultValue: "50%",
    },
    paddingSchemaProp("paddingLeft"),
    paddingSchemaProp("paddingRight"),
    paddingSchemaProp("paddingTop"),
    paddingSchemaProp("paddingBottom"),
    paddingSchemaProp("paddingInternal"),

    {
      prop: "snapCoverToEdges",
      type: "boolean",
    },

    // snapToEdgeSchemaProp("snapCoverToLeft"),
    // snapToEdgeSchemaProp("snapCoverToRight"),
    // snapToEdgeSchemaProp("snapCoverToTop"),
    // snapToEdgeSchemaProp("snapCoverToBottom"),
    noFillPaddingSchemaProp("noFillPaddingLeft"),
    noFillPaddingSchemaProp("noFillPaddingRight"),
    noFillPaddingSchemaProp("noFillPaddingTop"),
    noFillPaddingSchemaProp("noFillPaddingBottom"),
    {
      prop: "enableFill",
      type: "boolean",
      responsive: true,
    },
    {
      prop: "fillColor",
      type: "color",
    },
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
        normalize: pxValueNormalize(0, 32),
      },
      defaultValue: "0",
    },
    {
      prop: "Stack",
      type: "component",
      required: true,
      accepts: ["Stack"],
    },
    {
      prop: "CoverCard",
      type: "component",
      required: true,
      accepts: ["CoverCard"],
      visible: true,
    },
  ],
  editing: ({ editingInfo }) => {
    return {
      ...editingInfo,
      components: {
        Stack: {
          selectable: false,
        },
      },
    };
  },
  styles: ({ values }) => {
    let {
      fillColor,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      noFillPaddingTop,
      noFillPaddingBottom,
      noFillPaddingLeft,
      noFillPaddingRight,
      paddingInternal,
      snapCoverToEdges,
      // snapCoverToTop,
      // snapCoverToBottom,
      // snapCoverToLeft,
      // snapCoverToRight,
      coverPosition,
      coverWidth,
      enableFill,
      enableBorder,
      borderLeft,
      borderRight,
      borderTop,
      borderBottom,
      borderColor,
    } = values;

    const [coverMainPosition, coverAlign] = coverPosition.split("-");

    let stackPaddings: {
      left: string;
      right: string;
      top: string;
      bottom: string;
    };

    let coverPaddings: {
      left: string;
      right: string;
      top: string;
      bottom: string;
    };

    let gridTemplateColumns: string;

    let coverGridRow: string;
    let coverGridCol: string;
    let coverDisplay = "grid";

    let stackGridRow: string;
    let stackGridCol: string;

    const coverFr = parseInt(coverWidth.replace("%", ""));
    const stackFr = 100 - coverFr;

    const [stackAlign, stackJustify] = values.stackPosition.split("-");

    const isNaked =
      !enableFill && !enableBorder && coverPosition !== "background";

    if (isNaked) {
      paddingTop = noFillPaddingTop;
      paddingBottom = noFillPaddingBottom;
      paddingLeft = noFillPaddingLeft;
      paddingRight = noFillPaddingRight;

      // paddingTop = "0px";
      // paddingBottom = "0px";
      // paddingLeft = "0px";
      // paddingRight = "0px";
      // isFullWidth = true;
    }

    // const margin = paddingLeft;

    // const paddingOnMarginSide = isFullWidth
    //   ? `max(${margin}, ${paddingLeft})`
    //   : paddingLeft;

    // const paddingOnMarginSide = paddingLeft;

    const snapCoverToTop = snapCoverToEdges;
    const snapCoverToBottom = snapCoverToEdges;
    const snapCoverToLeft = snapCoverToEdges;
    const snapCoverToRight = snapCoverToEdges;

    if (coverMainPosition === "hide") {
      stackPaddings = {
        left: "0",
        right: "0",
        top: paddingTop,
        bottom: paddingBottom,
      };

      coverPaddings = {
        top: "0",
        bottom: "0",
        right: "0",
        left: "0",
      };

      gridTemplateColumns = `${paddingOnMarginSide} 1fr ${paddingOnMarginSide}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "1";
      coverDisplay = "none";
      coverGridRow = "initial";
      coverGridCol = "initial";
    } else if (coverMainPosition === "left") {
      stackPaddings = {
        left: paddingInternal,
        right: "0",
        top: paddingTop,
        bottom: paddingBottom,
      };

      coverPaddings = {
        top: snapCoverToTop ? 0 : paddingTop,
        bottom: snapCoverToBottom ? 0 : paddingBottom,
        right: "0",
        left: "0",
      };

      gridTemplateColumns = `${paddingOnMarginSide} ${coverFr}fr ${stackFr}fr ${paddingOnMarginSide}`;

      stackGridCol = "3 / span 1";
      stackGridRow = "1";
      coverGridRow = "1";

      if (snapCoverToLeft) {
        coverGridCol = "1 / span 2";
      } else {
        coverGridCol = "2 / span 1";
      }
    } else if (coverMainPosition === "right") {
      stackPaddings = {
        left: "0",
        right: paddingInternal,
        top: paddingTop,
        bottom: paddingBottom,
      };

      coverPaddings = {
        top: snapCoverToTop ? 0 : paddingTop,
        bottom: snapCoverToBottom ? 0 : paddingBottom,
        right: "0",
        left: "0",
      };

      gridTemplateColumns = `${paddingOnMarginSide} ${stackFr}fr ${coverFr}fr ${paddingOnMarginSide}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "1";
      coverGridRow = "1";

      if (snapCoverToRight) {
        coverGridCol = "3 / span 2";
      } else {
        coverGridCol = "3 / span 1";
      }
    } else if (coverMainPosition === "top") {
      stackPaddings = {
        left: "0",
        right: "0",
        top: paddingInternal,
        bottom: paddingBottom,
      };

      coverPaddings = {
        top: snapCoverToTop ? 0 : paddingTop,
        bottom: "0",
        right: "0",
        left: "0",
      };

      gridTemplateColumns = `${paddingOnMarginSide} 1fr ${paddingOnMarginSide}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "2";
      coverGridRow = "1";

      if (snapCoverToLeft && snapCoverToRight) {
        coverGridCol = "1 / span 3";
      } else if (snapCoverToLeft) {
        coverGridCol = "1 / span 2";
      } else if (snapCoverToRight) {
        coverGridCol = "2 / span 2";
      } else {
        coverGridCol = "2 / span 1";
      }
    } else if (coverMainPosition === "bottom") {
      stackPaddings = {
        left: "0",
        right: "0",
        top: paddingTop,
        bottom: paddingInternal,
      };

      coverPaddings = {
        top: "0",
        bottom: snapCoverToBottom ? 0 : paddingBottom,
        right: "0",
        left: "0",
      };

      gridTemplateColumns = `${paddingOnMarginSide} 1fr ${paddingOnMarginSide}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "1";
      coverGridRow = "2";

      if (snapCoverToLeft && snapCoverToRight) {
        coverGridCol = "1 / span 3";
      } else if (snapCoverToLeft) {
        coverGridCol = "1 / span 2";
      } else if (snapCoverToRight) {
        coverGridCol = "2 / span 2";
      } else {
        coverGridCol = "2 / span 1";
      }
    } else if (coverPosition === "background") {
      stackPaddings = {
        left: "0",
        right: "0",
        top: paddingTop,
        bottom: paddingBottom,
      };

      coverPaddings = {
        top: "0",
        bottom: "0",
        right: "0",
        left: "0",
      };

      gridTemplateColumns = `${paddingOnMarginSide} 1fr ${paddingOnMarginSide}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "1";
      coverGridRow = "1";
      coverGridCol = "1 / span 3";
    } else {
      throw "wrong cover position";
    }

    return {
      styled: {
        Root: {
          // paddingLeft: paddingLeft,
          // paddingRight: paddingRight,
          position: "relative",
        },
        Container: {
          margin: "0 auto",
          backgroundColor: enableFill ? fillColor : "initial",
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
          borderRadius: isNaked ? "initial" : `${values.cornerRadius}px`,
          overflow: isNaked ? "initial" : "hidden",

          display: "grid",
          gridTemplateColumns,
        },
        StackContainer: {
          paddingLeft: stackPaddings.left,
          paddingRight: stackPaddings.right,
          paddingTop: stackPaddings.top,
          paddingBottom: stackPaddings.bottom,
          gridRow: stackGridRow,
          gridColumn: stackGridCol,
          display: "grid",
          alignItems: toStartEnd(stackAlign),
          justifyItems: toStartEnd(stackJustify),
          position: "relative",
        },
        StackInnerContainer: {
          // background: "red",
        },
        CoverContainer: {
          display: coverDisplay,
          position: "relative",
          paddingLeft: coverPaddings.left,
          paddingRight: coverPaddings.right,
          paddingTop: coverPaddings.top,
          paddingBottom: coverPaddings.bottom,
          gridRow: coverGridRow,
          gridColumn: coverGridCol,
          alignSelf: coverAlign,
        },
      },
    };
  },
};

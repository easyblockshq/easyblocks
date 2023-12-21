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

    let gridTemplateColumns: string;
    let gridTemplateRows: string;

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
      snapCoverToEdges = true;
    }

    if (coverMainPosition === "hide") {
      if (isNaked) {
        paddingTop = "0";
        paddingBottom = "0";
        paddingLeft = "0";
        paddingRight = "0";
      }

      gridTemplateRows = `${paddingTop} 1fr ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} 1fr ${paddingRight}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "2 / span 1";

      coverDisplay = "none";
      coverGridRow = "initial";
      coverGridCol = "initial";
    } else if (coverMainPosition === "left") {
      if (isNaked) {
        paddingLeft = "0";
        paddingRight = "0";
      }

      gridTemplateRows = `${paddingTop} 1fr ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} ${coverFr}fr ${paddingInternal} ${stackFr}fr ${paddingRight}`;

      stackGridCol = "4";
      stackGridRow = "2";

      coverGridCol = "2";
      coverGridRow = "2";

      if (snapCoverToEdges) {
        coverGridCol = "1 / span 2";
        coverGridRow = "1 / span 3";
      }
    } else if (coverMainPosition === "right") {
      if (isNaked) {
        paddingLeft = "0";
        paddingRight = "0";
      }

      gridTemplateRows = `${paddingTop} 1fr ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} ${stackFr}fr ${paddingInternal} ${coverFr}fr ${paddingRight}`;

      stackGridCol = "2";
      stackGridRow = "2";

      coverGridCol = "4";
      coverGridRow = "2";

      if (snapCoverToEdges) {
        coverGridCol = "4 / span 2";
        coverGridRow = "1 / span 3";
      }
    } else if (coverMainPosition === "top") {
      if (isNaked) {
        paddingTop = "0";
        paddingBottom = "0";
      }

      gridTemplateRows = `${paddingTop} auto ${paddingInternal} auto ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} 1fr ${paddingRight}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "4";

      coverGridRow = "2";
      coverGridCol = "2";

      if (snapCoverToEdges) {
        coverGridRow = "1 / span 2";
        coverGridCol = "1 / span 3";
      }
    } else if (coverMainPosition === "bottom") {
      if (isNaked) {
        paddingTop = "0";
        paddingBottom = "0";
      }

      gridTemplateRows = `${paddingTop} auto ${paddingInternal} auto ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} 1fr ${paddingRight}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "2";

      coverGridRow = "4";
      coverGridCol = "2";

      if (snapCoverToEdges) {
        coverGridRow = "4 / span 2";
        coverGridCol = "1 / span 3";
      }
    } else if (coverPosition === "background") {
      if (isNaked) {
        paddingLeft = "0";
        paddingRight = "0";
        paddingTop = "0";
        paddingBottom = "0";
      }

      gridTemplateRows = `${paddingTop} 1fr ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} 1fr ${paddingRight}`;

      stackGridCol = "2";
      stackGridRow = "2";
      coverGridRow = "1 / span 3";
      coverGridCol = "1 / span 3";
    } else {
      throw "wrong cover position";
    }

    return {
      styled: {
        Root: {
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
          gridTemplateRows,
        },
        StackContainer: {
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
          gridRow: coverGridRow,
          gridColumn: coverGridCol,
          alignSelf: coverAlign,
        },
      },
    };
  },
};

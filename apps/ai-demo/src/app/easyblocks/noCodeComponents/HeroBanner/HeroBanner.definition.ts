import { NoCodeComponentDefinition, box, SchemaProp } from "@easyblocks/core";

function paddingSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "space",
    defaultValue: {
      ref: "16",
      value: "16px",
    },
  };
}

function snapToEdge(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "boolean",
  };
}

export const heroBannerNoCodeDefinition: NoCodeComponentDefinition = {
  id: "HeroBanner",
  label: "Hero Banner v2 NEW",
  type: "section",
  schema: [
    {
      prop: "containerMargin",
      label: "Container margin",
      type: "space",
      params: {
        prefix: "containerMargin",
      },
    },
    {
      prop: "containerMaxWidth", // main image size
      label: "Max width",
      type: "stringToken",
      params: {
        tokenId: "containerWidths",
      },
      defaultValue: {
        ref: "none",
        value: "none",
      },
    },
    {
      prop: "isFullWidth",
      label: "Full width",
      type: "boolean",
      responsive: true,
    },
    {
      prop: "coverPosition",
      label: "Cover position",
      type: "select",
      responsive: true,
      params: {
        options: ["left", "right", "top", "bottom", "background"],
      },
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
    snapToEdge("snapCoverToLeft"),
    snapToEdge("snapCoverToRight"),
    snapToEdge("snapCoverToTop"),
    snapToEdge("snapCoverToBottom"),
    {
      prop: "testColor",
      type: "color",
    },
    {
      prop: "Stack",
      type: "component",
      required: true,
      accepts: ["$stack"],
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
  styles: (values: any) => {
    const {
      isFullWidth,
      containerMargin,
      containerMaxWidth,
      testColor,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingInternal,
      snapCoverToTop,
      snapCoverToBottom,
      snapCoverToLeft,
      snapCoverToRight,
      coverPosition,
      coverWidth,
    } = values;

    const margin =
      containerMaxWidth === "none"
        ? containerMargin
        : `max(calc(calc(100vw - ${containerMaxWidth}px) / 2), ${containerMargin})`;
    const paddingOnMarginSide = isFullWidth
      ? `max(${margin}, ${paddingLeft})`
      : paddingLeft;

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
    let coverOrder: string;
    //
    // let coverGridRow: string;
    // let coverGridCol: string;
    //
    // let stackGridRow: string;
    // let stackGridCol: string;

    const coverWidthAsNumber = parseInt(coverWidth.replace("%", "")) / 100;

    if (coverPosition === "left") {
      stackPaddings = {
        left: paddingInternal,
        right: paddingOnMarginSide,
        top: paddingTop,
        bottom: paddingBottom,
      };

      coverPaddings = {
        top: snapCoverToTop ? 0 : paddingTop,
        bottom: snapCoverToBottom ? 0 : paddingBottom,
        right: "0",
        left: snapCoverToLeft ? 0 : paddingOnMarginSide,
      };

      coverOrder = "-1";
      gridTemplateColumns =
        coverWidth === "50%"
          ? `1fr 1fr`
          : `calc(calc(100vw - ${paddingOnMarginSide}) / 2) 1fr`;

      // gridTemplateColumns = `${margin} 1fr 1fr ${margin}`;
      // coverGridCol = "1 / span 2";
      // coverGridRow = "1"
      // stackGridCol = "3";
      // stackGridRow = "1";
    } else if (coverPosition === "right") {
      stackPaddings = {
        left: paddingOnMarginSide,
        right: paddingInternal,
        top: paddingTop,
        bottom: paddingBottom,
      };

      coverPaddings = {
        top: snapCoverToTop ? 0 : paddingTop,
        bottom: snapCoverToBottom ? 0 : paddingBottom,
        right: snapCoverToRight ? 0 : paddingOnMarginSide,
        left: "0",
      };

      gridTemplateColumns = "1fr 1fr";
      coverOrder = "initial";
    } else if (coverPosition === "top") {
      stackPaddings = {
        left: paddingOnMarginSide,
        right: paddingOnMarginSide,
        top: paddingInternal,
        bottom: paddingBottom,
      };

      coverPaddings = {
        top: snapCoverToTop ? 0 : paddingTop,
        bottom: "0",
        right: snapCoverToRight ? 0 : paddingOnMarginSide,
        left: snapCoverToLeft ? 0 : paddingOnMarginSide,
      };

      gridTemplateColumns = "1fr";
      coverOrder = "-1";
    } else if (coverPosition === "bottom") {
      stackPaddings = {
        left: paddingOnMarginSide,
        right: paddingOnMarginSide,
        top: paddingTop,
        bottom: paddingInternal,
      };

      coverPaddings = {
        top: "0",
        bottom: snapCoverToBottom ? 0 : paddingBottom,
        right: snapCoverToRight ? 0 : paddingOnMarginSide,
        left: snapCoverToLeft ? 0 : paddingOnMarginSide,
      };

      gridTemplateColumns = "1fr";
      coverOrder = "initial";
    } else {
      throw "dupa";
    }

    return {
      Root: box({
        paddingLeft: isFullWidth ? 0 : margin,
        paddingRight: isFullWidth ? 0 : margin,
        position: "relative",
      }),
      Container: box({
        margin: "0 auto",
        backgroundColor: testColor,

        display: "grid",
        gridTemplateColumns,
      }),
      StackContainer: box({
        paddingLeft: stackPaddings.left,
        paddingRight: stackPaddings.right,
        paddingTop: stackPaddings.top,
        paddingBottom: stackPaddings.bottom,
      }),
      CoverContainer: box({
        display: "grid",
        position: "relative",
        paddingLeft: coverPaddings.left,
        paddingRight: coverPaddings.right,
        paddingTop: coverPaddings.top,
        paddingBottom: coverPaddings.bottom,
        order: coverOrder,
      }),
      Cover: box({
        background: "black",
        aspectRatio: "16 / 9",
      }),

      // const DEBUG_COLOR = "rgb(34, 150, 254)";

      // // debug
      // DebugMarginLineLeft: box({
      //   position: "absolute",
      //   top: 0,
      //   left: containerMargin,
      //   width: 1,
      //   height: "100%",
      //   background: DEBUG_COLOR
      // }),
      // DebugMarginLineRight: box({
      //   position: "absolute",
      //   top: 0,
      //   right: containerMargin,
      //   width: 1,
      //   height: "100%",
      //   background: DEBUG_COLOR
      // })
    };
  },
};

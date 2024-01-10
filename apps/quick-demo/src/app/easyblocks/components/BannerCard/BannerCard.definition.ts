import {
  NoCodeComponentDefinition,
  SchemaProp,
  EditingField,
} from "@easyblocks/core";

import { toStartEnd } from "@/app/easyblocks/components/utils/toStartEnd";
import {
  borderSchemaProps,
  bordersEditing,
  bordersStyles,
} from "@/app/easyblocks/components/utils/borders";
import {
  cornerSchemaProps,
  cornerStyles,
} from "@/app/easyblocks/components/utils/corners";
import { getFieldProvider } from "@/app/easyblocks/components/utils/getFieldProvider";
import { bannerCardAuto } from "@/app/easyblocks/components/BannerCard/BannerCard.auto";

function noFillPaddingSchemaProp(
  prop: string,
  label: string,
  group: string
): SchemaProp {
  return {
    prop,
    label,
    group,
    type: "space",
    defaultValue: {
      tokenId: "0",
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
      label: "Position",
      group: "Cover",
      type: "select",
      responsive: true,
      params: {
        options: ["hide", "left", "right", "top", "bottom", "background"],
      },
    },
    {
      prop: "coverVerticalAlign",
      label: "Vertical align",
      group: "Cover",
      type: "select",
      params: {
        options: ["stretch", "start", "center", "end"],
      },
      visible: (values) => {
        return (
          values.coverPosition === "left" || values.coverPosition === "right"
        );
      },
    },
    {
      prop: "coverWidth",
      label: "Width",
      group: "Cover",
      type: "select",
      responsive: true,
      params: {
        options: ["25%", "33%", "40%", "50%", "60%", "66%", "75%"],
      },
      defaultValue: "50%",
      visible: (values) => {
        return (
          values.coverPosition === "left" || values.coverPosition === "right"
        );
      },
    },
    {
      prop: "snapCoverToEdges",
      label: "Snap to edges",
      group: "Cover",
      type: "boolean",
    },
    {
      prop: "CoverCard",
      label: "Cover",
      group: "Cover",
      type: "component",
      required: true,
      accepts: ["CoverCard"],
      visible: (values) => values.coverPosition === "background",
    },
    {
      prop: "stackPosition",
      label: "Position",
      group: "Stack",
      type: "position",
      responsive: true,
    },
    paddingSchemaProp("paddingLeft", "Left", "Padding"),
    paddingSchemaProp("paddingRight", "Right", "Padding"),
    paddingSchemaProp("paddingTop", "Top", "Padding"),
    paddingSchemaProp("paddingBottom", "Bottom", "Padding"),

    noFillPaddingSchemaProp("noFillPaddingLeft", "Left", "Padding"),
    noFillPaddingSchemaProp("noFillPaddingRight", "Right", "Padding"),
    noFillPaddingSchemaProp("noFillPaddingTop", "Top", "Padding"),
    noFillPaddingSchemaProp("noFillPaddingBottom", "Bottom", "Padding"),

    paddingSchemaProp("paddingInternal", "Internal", "Padding"),

    /**
     * forceStandardHorizontalPaddings
     *
     * This is a special property that is ignored in BannerCard.
     * However, in case of BannerSection which reuses BannerCard this property might be set to true.
     * It happens when section is aligned to screen edges (escapeMargin = true) - in that case we want to use standard paddings instead of noFill ones.
     */
    {
      prop: "forceStandardHorizontalPaddings",
      type: "boolean",
      responsive: true,
      visible: false,
      defaultValue: false,
    },

    {
      prop: "enableFill",
      label: "Enable",
      group: "Fill",
      type: "boolean",
      responsive: true,
    },

    {
      prop: "fillColor",
      label: "Color",
      group: "Fill",
      type: "color",
    },
    ...borderSchemaProps,
    ...cornerSchemaProps,
    {
      prop: "Stack",
      type: "component",
      required: true,
      accepts: ["Stack"],
    },
  ],

  styles: ({ values }) => {
    let {
      fillColor,
      paddingInternal,
      snapCoverToEdges,
      coverPosition,
      coverWidth,
      enableFill,
      coverVerticalAlign,
      forceStandardHorizontalPaddings,
    } = values;

    const { isNaked, paddingModes, stackAlign, stackJustify } =
      calculateBannerCardStuff(values);

    let gridTemplateColumns: string;
    let gridTemplateRows: string;

    let coverGridRow: string;
    let coverGridCol: string;
    let coverDisplay = "grid";

    let stackGridRow: string;
    let stackGridCol: string;

    const coverFr = parseInt(coverWidth.replace("%", ""));
    const stackFr = 100 - coverFr;

    if (isNaked) {
      snapCoverToEdges = true;
    }

    const paddingLeft = calculatePadding(
      values.paddingLeft,
      values.noFillPaddingLeft,
      paddingModes.left
    );
    const paddingRight = calculatePadding(
      values.paddingRight,
      values.noFillPaddingRight,
      paddingModes.right
    );
    const paddingTop = calculatePadding(
      values.paddingTop,
      values.noFillPaddingTop,
      paddingModes.top
    );
    const paddingBottom = calculatePadding(
      values.paddingBottom,
      values.noFillPaddingBottom,
      paddingModes.bottom
    );

    if (coverPosition === "hide") {
      gridTemplateRows = `${paddingTop} 1fr ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} 1fr ${paddingRight}`;

      stackGridCol = "2 / span 1";
      stackGridRow = "2 / span 1";

      coverDisplay = "none";
      coverGridRow = "initial";
      coverGridCol = "initial";
    } else if (coverPosition === "left") {
      gridTemplateRows = `${paddingTop} 1fr ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} calc(${coverWidth} - ${paddingLeft}) ${paddingInternal} 1fr ${paddingRight}`;

      stackGridCol = "4";
      stackGridRow = "2";

      coverGridCol = "2";
      coverGridRow = "2";

      if (snapCoverToEdges) {
        coverGridCol = "1 / span 2";
        coverGridRow = "1 / span 3";
      }
    } else if (coverPosition === "right") {
      gridTemplateRows = `${paddingTop} 1fr ${paddingBottom}`;
      gridTemplateColumns = `${paddingLeft} 1fr ${paddingInternal} calc(${coverWidth} - ${paddingRight}) ${paddingRight}`;

      stackGridCol = "2";
      stackGridRow = "2";

      coverGridCol = "4";
      coverGridRow = "2";

      if (snapCoverToEdges) {
        coverGridCol = "4 / span 2";
        coverGridRow = "1 / span 3";
      }
    } else if (coverPosition === "top") {
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
    } else if (coverPosition === "bottom") {
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
          ...bordersStyles(values),
          ...cornerStyles(values, isNaked),
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
          alignSelf: coverVerticalAlign,
        },
      },
    };
  },
  editing: ({ editingInfo, values }) => {
    const { isNaked, paddingModes } = calculateBannerCardStuff(values);

    const getField = getFieldProvider(editingInfo);

    const setPaddingFieldVisibilityBasedOnMode = (
      standardPaddingField: EditingField,
      noFillPaddingField: EditingField,
      paddingMode: PaddingMode
    ) => {
      if (paddingMode === "standard") {
        standardPaddingField.visible = true;
        noFillPaddingField.visible = false;
      } else if (paddingMode === "noFill") {
        standardPaddingField.visible = false;
        noFillPaddingField.visible = true;
      } else {
        standardPaddingField.visible = false;
        noFillPaddingField.visible = false;
      }
    };

    const coverVerticalAlign = getField("coverVerticalAlign");
    const coverWidth = getField("coverWidth");
    const snapCoverToEdges = getField("snapCoverToEdges");

    const paddingLeft = getField("paddingLeft");
    const paddingRight = getField("paddingRight");
    const paddingTop = getField("paddingTop");
    const paddingBottom = getField("paddingBottom");
    const noFillPaddingLeft = getField("noFillPaddingLeft");
    const noFillPaddingRight = getField("noFillPaddingRight");
    const noFillPaddingTop = getField("noFillPaddingTop");
    const noFillPaddingBottom = getField("noFillPaddingBottom");
    const paddingInternal = getField("paddingInternal");

    const fillColor = getField("fillColor");

    setPaddingFieldVisibilityBasedOnMode(
      paddingLeft,
      noFillPaddingLeft,
      paddingModes.left
    );
    setPaddingFieldVisibilityBasedOnMode(
      paddingRight,
      noFillPaddingRight,
      paddingModes.right
    );
    setPaddingFieldVisibilityBasedOnMode(
      paddingTop,
      noFillPaddingTop,
      paddingModes.top
    );
    setPaddingFieldVisibilityBasedOnMode(
      paddingBottom,
      noFillPaddingBottom,
      paddingModes.bottom
    );

    paddingInternal.visible = paddingModes.internal === "standard";

    if (values.coverPosition !== "left" && values.coverPosition !== "right") {
      coverVerticalAlign.visible = false;
      coverWidth.visible = false;
    }

    if (
      isNaked ||
      values.coverPosition === "background" ||
      values.coverPosition === "hide"
    ) {
      snapCoverToEdges.visible = false;
    }

    if (!values.enableFill) {
      fillColor.visible = false;
    }

    bordersEditing(editingInfo, values);

    return {
      ...editingInfo,
      components: {
        Stack: {
          selectable: false,
        },
      },
    };
  },
  auto: bannerCardAuto,
};

type PaddingMode = "standard" | "standard-hidden" | "noFill" | "none";

function calculateBannerCardStuff(values: Record<string, any>) {
  const {
    enableFill,
    enableBorder,
    coverPosition,
    forceStandardHorizontalPaddings,
  } = values;

  const [stackAlign, stackJustify] = values.stackPosition.split("-");

  const isNaked =
    !enableFill && !enableBorder && coverPosition !== "background";

  const paddingModes = {
    left: "standard" as PaddingMode,
    right: "standard" as PaddingMode,
    top: "standard" as PaddingMode,
    bottom: "standard" as PaddingMode,
    internal: "standard" as PaddingMode,
  };

  if (coverPosition === "hide") {
    paddingModes.left = isNaked ? "none" : "standard";
    paddingModes.right = isNaked ? "none" : "standard";
    paddingModes.top = isNaked ? "none" : "standard";
    paddingModes.bottom = isNaked ? "none" : "standard";
    paddingModes.internal = "none";
  } else if (coverPosition === "left" || coverPosition === "right") {
    paddingModes.left = isNaked ? "none" : "standard";
    paddingModes.right = isNaked ? "none" : "standard";
    paddingModes.top = isNaked ? "noFill" : "standard";
    paddingModes.bottom = isNaked ? "noFill" : "standard";
    paddingModes.internal = "standard";
  } else if (coverPosition === "top" || coverPosition === "bottom") {
    paddingModes.left = isNaked ? "noFill" : "standard";
    paddingModes.right = isNaked ? "noFill" : "standard";
    paddingModes.top = isNaked ? "none" : "standard";
    paddingModes.bottom = isNaked ? "none" : "standard";
    paddingModes.internal = "standard";
  } else if (coverPosition === "background") {
    paddingModes.left = "standard";
    paddingModes.right = "standard";
    paddingModes.top = "standard";
    paddingModes.bottom = "standard";
    paddingModes.internal = "none";
  }

  if (forceStandardHorizontalPaddings) {
    paddingModes.left = "standard-hidden";
    paddingModes.right = "standard-hidden";
  }

  return {
    isNaked,
    paddingModes,
    stackAlign,
    stackJustify,
  };
}

function calculatePadding(
  padding: string,
  noFillPadding: string,
  paddingMode: PaddingMode
) {
  if (paddingMode === "none") {
    return "0px";
  } else if (paddingMode === "noFill") {
    return noFillPadding;
  } else {
    return padding;
  }
}

export function paddingSchemaProp(
  prop: string,
  label: string,
  group: string
): SchemaProp {
  return {
    prop,
    label,
    group,
    type: "space",
    defaultValue: {
      tokenId: "16",
      value: "16px",
    },
  };
}

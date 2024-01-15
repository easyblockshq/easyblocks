/**
 * This file contains all the building blocks for a universal section wrapper. Section wrapper handles:
 * 1. Container max width
 * 2. Container margins
 * 3. Section header and footer
 *
 */

import {
  NoCodeComponentEditingFunction,
  NoCodeComponentStylesFunctionInput,
  SchemaProp,
  Spacing,
  spacingToPx,
  DeviceRange,
  TrulyResponsiveValue,
  responsiveValueGetDefinedValue,
  responsiveValueForceGet,
  responsiveValueFlatten,
  responsiveValueMap,
  Devices,
} from "@easyblocks/core";

export const sectionWrapperSchemaProps: {
  margins: SchemaProp[];
  headerAndBackground: SchemaProp[];
} = {
  margins: [
    {
      prop: "containerMargin",
      label: "Left / Right",
      type: "space",
      group: "Section margins",
      params: {
        prefix: "containerMargin",
      },
      defaultValue: {
        tokenId: "containerMargin.default",
      },
    },
    {
      prop: "containerMaxWidth", // main image size
      label: "Max width",
      type: "containerWidth",
      group: "Section margins",
    },
  ],
  headerAndBackground: [
    {
      prop: "headerMode",
      label: "Variant",
      type: "select",
      params: {
        options: [
          { value: "none", label: "No header" },
          { value: "1-stack", label: "1 stack" },
          { value: "2-stacks", label: "2 stacks" },
        ],
      },
      group: "Section Header",
    },
    {
      prop: "layout1Stack",
      label: "Position",
      type: "select",
      group: "Section Header",
      params: {
        options: [
          {
            value: "left",
            label: "Left",
          },
          {
            value: "center",
            label: "Center",
          },
          {
            value: "right",
            label: "Right",
          },
        ],
      },
      visible: (values) => {
        return values.headerMode === "1-stack";
      },
    },
    {
      prop: "layout2Stacks",
      label: "Position",
      type: "select",
      responsive: true,
      group: "Section Header",
      params: {
        options: [
          {
            value: "left-right",
            label: "left + right",
          },
          {
            value: "center-right",
            label: "center + right",
          },
          {
            value: "stacked-left",
            label: "stacked left",
          },
          {
            value: "stacked-center",
            label: "stacked center",
          },
          {
            value: "stacked-right",
            label: "stacked right",
          },
          {
            value: "below-left",
            label: "above+below left",
          },
          {
            value: "below-center",
            label: "above+below center",
          },
          {
            value: "below-right",
            label: "above+below right",
          },
        ],
      },
      visible: (values) => {
        return values.headerMode === "2-stacks";
      },
    },
    {
      prop: "layout2StacksVerticalAlign",
      label: "Align",
      type: "select",
      responsive: true,
      group: "Section Header",
      params: {
        options: ["center", "top", "bottom"],
      },
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          !values.layout2Stacks.startsWith("stacked") &&
          !values.layout2Stacks.startsWith("below")
        );
      },
    },

    {
      prop: "headerStacksGap",
      label: "Stacks gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          values.layout2Stacks &&
          values.layout2Stacks.startsWith("stacked")
        );
      },
      defaultValue: {
        tokenId: "12",
      },
    },

    {
      prop: "headerSectionGap",
      label: "Gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return values.headerMode !== "none";
      },
      defaultValue: {
        tokenId: "12",
      },
    },
    {
      prop: "footerSectionGap",
      label: "Bottom gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          values.layout2Stacks &&
          values.layout2Stacks.startsWith("below")
        );
      },
      defaultValue: {
        tokenId: "12",
      },
    },
    /**
     * The problem is that we can't show label based on values :(
     */
    {
      prop: "HeaderStack",
      label: "Stack",
      type: "component",
      accepts: ["Stack"],
      required: true,
    },
    {
      prop: "HeaderSecondaryStack",
      label: "Stack",
      type: "component",
      accepts: ["Stack"],
      required: true,
    },

    // section background
    {
      prop: "Background__",
      label: "Outer Background",
      type: "component",
      group: "Section background",
      accepts: ["SolidColor", "Image", "Video"],
      visible: true,
    },
    {
      prop: "padding",
      label: "Inner margin",
      type: "space",
      group: "Section background",
      visible: (values) => {
        return values.Background__ && values.Background__.length > 0;
      },
      defaultValue: {
        tokenId: "24",
      },
    },
  ],
};

export type SectionWrapperValues = {
  containerMargin: Spacing;
  containerMaxWidth: string;
  hide: boolean;
  headerMode: string;
  layout1Stack: string;
  layout2Stacks: string;
  layout2StacksVerticalAlign: string;
  headerStacksGap: Spacing;
  headerSectionGap: Spacing;
  footerSectionGap: Spacing;
  HeaderStack: any[];
  HeaderSecondaryStack: any[];
  Background__: any[];
  padding: Spacing;
  Component: any[];
  _template: string;
};

export function sectionWrapperCalculateMarginAndMaxWidth(
  containerMargin: string,
  containerMaxWidth: string,
  device: DeviceRange
) {
  const maxWidth =
    containerMaxWidth === "none" || isNaN(parseInt(containerMaxWidth))
      ? null
      : parseInt(containerMaxWidth);

  const getCssAbsoluteMargin = (margin: string) => {
    return maxWidth !== null
      ? `max(${margin}, calc(calc(100% - ${maxWidth}px) / 2))`
      : margin;
  };

  const marginCss = getCssAbsoluteMargin(containerMargin);

  const containerMarginPx = spacingToPx(containerMargin, device.w);
  const deviceWidthMinusMargins = device.w - containerMarginPx * 2;
  let containerWidth: number;

  if (maxWidth && maxWidth < deviceWidthMinusMargins) {
    containerWidth = maxWidth;
  } else {
    containerWidth = deviceWidthMinusMargins;
  }

  return {
    margin: {
      css: marginCss,
      px: (device.w - containerWidth) / 2,
    },
    containerWidth: {
      px: containerWidth,
    },
  };
}

export function sectionWrapperStyles({
  values,
  params,
  isEditing,
  device,
}: NoCodeComponentStylesFunctionInput<SectionWrapperValues>) {
  const $width = params.$width;

  const styles: { [key: string]: { [key: string]: any } } = {
    grid: {},
    content: {},
    header: {},
    headerSecondary: {},
    HeaderStack: {
      $width,
      $widthAuto: true,
    },
    HeaderSecondaryStack: {
      $width,
      $widthAuto: true,
    },
  };

  const { margin } = sectionWrapperCalculateMarginAndMaxWidth(
    values.containerMargin,
    values.containerMaxWidth,
    device
  );

  if (values.headerMode === "1-stack") {
    styles.grid.gridTemplateColumns = `${margin.css} 1fr ${margin.css}`;

    styles.content.gridColumn = "1 / span 3";
    styles.content.gridRow = "2 / span 1";
    styles.content.marginTop = values.headerSectionGap;

    styles.header.gridColumn = "2 / span 1";
    styles.header.gridRow = "1 / span 1";
    styles.header.display = "flex";
    styles.header.justifyContent =
      values.layout1Stack === "left"
        ? "flex-start"
        : values.layout1Stack === "right"
        ? "flex-end"
        : "center";

    styles.HeaderStack.passedAlign = values.layout1Stack;
  } else if (values.headerMode === "2-stacks") {
    if (
      values.layout2Stacks.startsWith("below") ||
      values.layout2Stacks.startsWith("stacked")
    ) {
      const [, align] = values.layout2Stacks.split("-");
      const isBelow = values.layout2Stacks.startsWith("below");

      styles.grid.gridTemplateColumns = `${margin.css} 1fr ${margin.css}`;

      styles.header.gridColumn = "2 / span 1";
      styles.header.gridRow = "1 / span 1";
      styles.header.justifySelf = align;
      styles.HeaderStack.passedAlign = align;

      styles.headerSecondary.gridColumn = "2 / span 1";
      styles.headerSecondary.gridRow = `${isBelow ? 3 : 2} / span 1`;
      styles.headerSecondary.justifySelf = align;
      styles.HeaderSecondaryStack.passedAlign = align;
      styles.headerSecondary.marginTop = isBelow
        ? values.footerSectionGap
        : values.headerStacksGap;

      styles.content.gridColumn = "1 / span 3";
      styles.content.gridRow = `${isBelow ? 2 : 3} / span 1`;
      styles.content.marginTop = values.headerSectionGap;
    } else {
      const [primaryPos, secondaryPos] = values.layout2Stacks.split("-");

      /**
       * Solution with items on the same grid cell is shitty but:
       * - we can do it on the same markup
       * - display: contents doesn't work on iOS Safari (accessibility bug), so we can't do flex +
       * grid
       * - pure flexbox solution with flex:wrap would work but left / center / right layout not
       * possible
       * - OK, flexbox layout is possible with placeholder, but weird things are happening if title
       * is VERY long.
       * - We could try to solve that problem but it's highly unlikely there's a good solution
       * without duplication.
       *
       * Overlapping items have huge problems with selection. Terrible UX.
       *
       * Let's just do simple FR for now! (1 / 2)
       */

      if (primaryPos === "left") {
        styles.grid.gridTemplateColumns = `${margin.css} 1fr 1fr ${margin.css}`;

        styles.content.gridColumn = "1 / span 4";
        styles.content.gridRow = "2 / span 1";
        styles.content.marginTop = values.headerSectionGap;

        styles.header.gridColumn = "2 / span 1";
        styles.header.gridRow = "1 / span 1";
        styles.header.justifySelf = "left";

        styles.headerSecondary.gridColumn = "3 / span 1";
        styles.headerSecondary.gridRow = "1 / span 1";
        styles.headerSecondary.justifySelf = "right";

        styles.HeaderStack.passedAlign = "left";
        styles.HeaderSecondaryStack.passedAlign = "right";
      } else {
        // center + right
        styles.grid.gridTemplateColumns = `${margin.css} 1fr 2fr 1fr ${margin.css}`;

        styles.content.gridColumn = "1 / span 5";
        styles.content.gridRow = "2 / span 1";
        styles.content.marginTop = values.headerSectionGap;

        styles.header.gridColumn = "3 / span 1";
        styles.header.gridRow = "1 / span 1";
        styles.header.justifySelf = "center";

        styles.headerSecondary.gridColumn = "4 / span 1";
        styles.headerSecondary.gridRow = "1 / span 1";
        styles.headerSecondary.justifySelf = "right";

        styles.HeaderStack.passedAlign = "center";
        styles.HeaderSecondaryStack.passedAlign = "right";
      }

      if (values.layout2StacksVerticalAlign === "top") {
        styles.grid.alignItems = "start";
      } else if (values.layout2StacksVerticalAlign === "center") {
        styles.grid.alignItems = "center";
      } else {
        styles.grid.alignItems = "end";
      }
    }
  } else {
    styles.grid.gridTemplateColumns = `1fr`;
    styles.content.gridColumn = "1 / span 1";
  }

  const hasNoBackground =
    !values.Background__ || values.Background__.length === 0;

  return {
    styled: {
      Root__: {
        __as: "section",
        position: "relative",
        paddingTop: hasNoBackground ? "0px" : values.padding,
        paddingBottom: hasNoBackground ? "0px" : values.padding,
        display: !isEditing && values.hide ? "none" : "block",
        opacity: isEditing && values.hide ? 0.33 : 1,
      },
      BackgroundContainer__: {
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        display: "grid",
      },
      Container__: {
        position: "relative",
        paddingLeft: 0,
        paddingRight: 0,
        display: "grid",
        gridTemplateRows: "auto auto auto",
        ...styles.grid,
      },
      HeaderStackContainer__: styles.header,
      SubheaderStackContainer__: styles.headerSecondary,
      ContentContainer__: {
        ...styles.content,
        position: "relative",
      },
    },

    components: {
      Background__: {
        noAction: true,
      },
      HeaderStack: styles.HeaderStack,
      HeaderSecondaryStack: styles.HeaderSecondaryStack,
    },
  };
}

export const sectionWrapperEditing: NoCodeComponentEditingFunction = ({
  editingInfo,
}) => {
  const fields = Object.fromEntries(editingInfo.fields.map((f) => [f.path, f]));
  return {
    components: {
      Background__: {
        selectable: false,
      },
      HeaderStack: {
        fields: [
          fields.headerMode,
          fields.layout1Stack,
          fields.layout2Stacks,
          fields.headerSectionGap,
          fields.layout2StacksVerticalAlign,
          fields.footerSectionGap,
          fields.headerStacksGap,
        ],
      },
      HeaderSecondaryStack: {
        fields: [
          fields.headerMode,
          fields.layout2Stacks,
          fields.headerSectionGap,
          fields.layout2StacksVerticalAlign,
          fields.footerSectionGap,
          fields.headerStacksGap,
        ],
      },
    },
  };
};

/**
 * A helper for calculating widths. Used by auto functions. Widths is a responsive value that is a "real" width of grid container (without margins).
 * It takes into account margins, margin escape and max width.
 *
 * It's important because auto function is built with respect to those "real widths".
 *
 * Why?
 *
 * Imagine situation when screen width is 1600px and grid component is only 800px wide and margins on left and right are 400px.
 * When we switch screen to 1000px it's highly possible that the grid will still be 800px wide but the screen resolution changed a lot.
 * In such case auto shouldn't switch for example 4-column grid to 2-column grid. It should stay 4-column.
 * If we calculated auto based on screen width (params.$width) the behaviour would be incorrect.
 *
 */
export const sectionWrapperGetContainerWidths = (
  values: Record<string, any>,
  devices: Devices
) => {
  const widths: TrulyResponsiveValue<number> = { $res: true };

  devices.forEach((device) => {
    const escapeMargin = responsiveValueGetDefinedValue(
      values.escapeMargin,
      device.id,
      devices
    );
    const containerMargin = escapeMargin
      ? "0px"
      : responsiveValueForceGet(
          responsiveValueFlatten(
            responsiveValueMap(values.containerMargin, (val) => val.value),
            devices
          ),
          device.id
        ); // TODO: we should have helpers to make those operations easier

    const containerMaxWidth = responsiveValueGetDefinedValue(
      values.containerMaxWidth,
      device.id,
      devices
    ).value;

    const { containerWidth } = sectionWrapperCalculateMarginAndMaxWidth(
      escapeMargin ? "0px" : containerMargin,
      containerMaxWidth,
      device
    );

    widths[device.id] = containerWidth.px;
  });

  return widths;
};

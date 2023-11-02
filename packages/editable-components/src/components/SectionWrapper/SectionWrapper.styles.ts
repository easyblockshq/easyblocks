import { spacingToPx } from "@easyblocks/app-utils";
import { box } from "../../box";
import { CompiledComponentStylesToolkit } from "../../types";
import { SectionWrapperCompiledValues } from "./SectionWrapper.types";

export function $sectionWrapperStyles(
  compiled: SectionWrapperCompiledValues,
  t: CompiledComponentStylesToolkit
) {
  const $width = t.$width;

  if ($width === -1) {
    throw new Error("$sectionWrapper without width!!!");
  }

  const styles: { [key: string]: { [key: string]: any } } = {
    grid: {},
    content: {},
    header: {},
    headerSecondary: {},
    HeaderStack: {
      $width: t.$width,
      $widthAuto: true,
    },
    HeaderSecondaryStack: {
      $width: t.$width,
      $widthAuto: true,
    },
  };

  const maxWidth =
    compiled.containerMaxWidth === "none" ||
    isNaN(parseInt(compiled.containerMaxWidth))
      ? null
      : parseInt(compiled.containerMaxWidth);

  const containerMargin: { css: string; px: number } = {
    css: compiled.containerMargin,
    px: spacingToPx(compiled.containerMargin, t.device.w),
  };

  const containerWidth = $width - containerMargin.px * 2;

  // const applyMaxWidth = maxWidth && maxWidth < containerWidth;

  const getCssAbsoluteMargin = (margin: string) => {
    return maxWidth !== null
      ? `max(${margin}, calc(calc(100% - ${maxWidth}px) / 2))`
      : margin;
  };

  const margin = getCssAbsoluteMargin(containerMargin.css);

  if (compiled.headerMode === "1-stack") {
    styles.grid.gridTemplateColumns = `${margin} 1fr ${margin}`;

    styles.content.gridColumn = "1 / span 3";
    styles.content.gridRow = "2 / span 1";
    styles.content.marginTop = compiled.headerSectionGap;

    styles.header.gridColumn = "2 / span 1";
    styles.header.gridRow = "1 / span 1";
    styles.header.display = "flex";
    styles.header.justifyContent =
      compiled.layout1Stack === "left"
        ? "flex-start"
        : compiled.layout1Stack === "right"
        ? "flex-end"
        : "center";

    styles.HeaderStack.passedAlign = compiled.layout1Stack;
  } else if (compiled.headerMode === "2-stacks") {
    if (
      compiled.layout2Stacks.startsWith("below") ||
      compiled.layout2Stacks.startsWith("stacked")
    ) {
      const [, align] = compiled.layout2Stacks.split("-");
      const isBelow = compiled.layout2Stacks.startsWith("below");

      styles.grid.gridTemplateColumns = `${margin} 1fr ${margin}`;

      styles.header.gridColumn = "2 / span 1";
      styles.header.gridRow = "1 / span 1";
      styles.header.justifySelf = align;
      styles.HeaderStack.passedAlign = align;

      styles.headerSecondary.gridColumn = "2 / span 1";
      styles.headerSecondary.gridRow = `${isBelow ? 3 : 2} / span 1`;
      styles.headerSecondary.justifySelf = align;
      styles.HeaderSecondaryStack.passedAlign = align;
      styles.headerSecondary.marginTop = isBelow
        ? compiled.footerSectionGap
        : compiled.headerStacksGap;

      styles.content.gridColumn = "1 / span 3";
      styles.content.gridRow = `${isBelow ? 2 : 3} / span 1`;
      styles.content.marginTop = compiled.headerSectionGap;
    } else {
      const [primaryPos, secondaryPos] = compiled.layout2Stacks.split("-");

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
        styles.grid.gridTemplateColumns = `${margin} 1fr 1fr ${margin}`;

        styles.content.gridColumn = "1 / span 4";
        styles.content.gridRow = "2 / span 1";
        styles.content.marginTop = compiled.headerSectionGap;

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
        styles.grid.gridTemplateColumns = `${margin} 1fr 2fr 1fr ${margin}`;

        styles.content.gridColumn = "1 / span 5";
        styles.content.gridRow = "2 / span 1";
        styles.content.marginTop = compiled.headerSectionGap;

        styles.header.gridColumn = "3 / span 1";
        styles.header.gridRow = "1 / span 1";
        styles.header.justifySelf = "center";

        styles.headerSecondary.gridColumn = "4 / span 1";
        styles.headerSecondary.gridRow = "1 / span 1";
        styles.headerSecondary.justifySelf = "right";

        styles.HeaderStack.passedAlign = "center";
        styles.HeaderSecondaryStack.passedAlign = "right";
      }

      if (compiled.layout2StacksVerticalAlign === "top") {
        styles.grid.alignItems = "start";
      } else if (compiled.layout2StacksVerticalAlign === "center") {
        styles.grid.alignItems = "center";
      } else {
        styles.grid.alignItems = "end";
      }
    }
  } else {
    styles.grid.gridTemplateColumns = `1fr`;
    styles.content.gridColumn = "1 / span 1";
  }

  // container max width
  // styles.grid.width = "100%";
  // styles.grid.justifySelf = "center";

  let Component: Record<string, any>;

  // GridCard handles margins on its own because of advanced margins
  if (compiled.Component[0]._template === "$GridCard") {
    Component = {
      edgeLeft: true,
      edgeLeftMargin: containerMargin.css,
      edgeRight: true,
      edgeRightMargin: containerMargin.css,
      escapeMargin: !!compiled.escapeMargin,
      maxWidth: maxWidth,
      $width,
    };
  } else {
    // we must always display paddings even if max width is applied.
    const escapeMargin = !!compiled.escapeMargin;

    styles.content.paddingLeft = getCssAbsoluteMargin(
      escapeMargin ? "0px" : containerMargin.css
    );
    styles.content.paddingRight = getCssAbsoluteMargin(
      escapeMargin ? "0px" : containerMargin.css
    );

    // Should we apply max width
    if (maxWidth && maxWidth < containerWidth) {
      // styles.grid.maxWidth = `${maxWidth + leftMargin + rightMargin}px`;
      Component = {
        edgeLeft: false,
        edgeRight: false,
        edgeLeftMargin: null,
        edgeRightMargin: null,
        $width: maxWidth,
      };
    } else {
      Component = {
        edgeLeft: escapeMargin,
        edgeRight: escapeMargin,
        edgeLeftMargin: escapeMargin ? containerMargin.css : null,
        edgeRightMargin: escapeMargin ? containerMargin.css : null,
        $width: escapeMargin ? $width : $width - 2 * containerMargin.px,
      };
    }
  }

  const hasNoBackground =
    !compiled.Background__ || compiled.Background__.length === 0;

  return {
    Root__: box(
      {
        position: "relative",
        paddingTop: hasNoBackground ? "0px" : compiled.padding,
        paddingBottom: hasNoBackground ? "0px" : compiled.padding,
        display:
          !t.compilationContext.isEditing && compiled.hide ? "none" : "block",
        opacity: t.compilationContext.isEditing && compiled.hide ? 0.33 : 1,
      },
      "section"
    ),
    BackgroundContainer__: box({
      position: "absolute",
      top: 0,
      left: 0,
      overflow: "hidden",
      width: "100%",
      height: "100%",
      display: "grid",
    }),
    Container__: box({
      position: "relative",
      paddingLeft: 0,
      paddingRight: 0,
      display: "grid",
      gridTemplateRows: "auto auto auto",
      ...styles.grid,
    }),
    Background__: {
      noAction: true,
    },
    HeaderStackContainer__: box(styles.header),
    SubheaderStackContainer__: box(styles.headerSecondary),
    ContentContainer__: box({
      ...styles.content,
      position: "relative",
    }),
    HeaderStack: styles.HeaderStack,
    HeaderSecondaryStack: styles.HeaderSecondaryStack,
    Component: {
      ...Component,
      tracingType: "section",
    },
  };
}

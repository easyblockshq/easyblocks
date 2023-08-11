import { box } from "../../box";
import { CompiledComponentStylesToolkit } from "../../types";
import { BannerCardCompiledValues } from "./BannerCard.types";

function styles(
  config: BannerCardCompiledValues,
  { compilationContext, $width }: CompiledComponentStylesToolkit
) {
  // For now only mobile possible

  const { cornerRadius } = config;

  const isEditing = compilationContext.isEditing;

  const posH = config.positionHorizontal;
  const posV = config.verticalAlign;

  const offH =
    config.Background.length === 0 &&
    config.SideImage.length > 0 &&
    (config.sideImagePosition === "top" ||
      config.sideImagePosition === "bottom")
      ? config.offsetHorizontalForVerticalImagePosition
      : config.offsetHorizontal;

  const offV = config.offsetVertical;

  const flexPosH =
    posH === "left" ? "flex-start" : posH === "center" ? "center" : "flex-end";
  const flexPosV =
    posV === "top" ? "flex-start" : posV === "center" ? "center" : "flex-end";

  const stackContainerGridRow = "1 / span 1";

  let backgroundAspectRatio = "none";

  const offset: Record<string, string> = {
    left: offH,
    right: offH,
    top: offV,
    bottom: offV,
  };

  const mainImageOn = config.SideImage.length > 0;
  const isSideMode =
    mainImageOn &&
    (config.sideImagePosition === "left" ||
      config.sideImagePosition === "right");
  const isBackgroundMode =
    mainImageOn && config.sideImagePosition === "background";

  let rootStyles: Record<string, any> = {};
  let sidePhotoStyles: Record<string, any> = {};
  let contentStyles: Record<string, any> = {};

  let $stackWidth = $width; // approximation

  if (!mainImageOn) {
    rootStyles = {
      display: "grid",
    };
    sidePhotoStyles = {
      display: "none",
    };

    if (config.size !== "fit-content" && config.size !== "natural") {
      backgroundAspectRatio = config.size;
    }
    // backgroundAspectRatio = config.size === "fit-content" ? "none" : parseAspectRatio(config.size);
  } else if (!isBackgroundMode) {
    // rootStyles = {
    //   display: "flex",
    //   alignItems: "stretch",
    // };
    // sidePhotoStyles = {
    //   flex: "0 0 50%",
    // };
    // contentStyles = {
    //   flex: "1 1 auto",
    // };

    if (isSideMode) {
      rootStyles = {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "row",
      };

      sidePhotoStyles = {
        flex: "0 0 50%",
      };

      contentStyles = {
        flex: "0 0 50%",
      };

      rootStyles.flexDirection = "row";

      if (config.sideImagePosition === "right") {
        // sidePhotoOrder = 1;
        sidePhotoStyles.order = 1;
      }

      $stackWidth = $width / 2;

      // content don't "make height" in side-by-side
      // placeholderPaddingBottom = "auto"
    } else {
      rootStyles = {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
      };

      sidePhotoStyles = {
        flex: "0 0 auto",
      };

      contentStyles = {
        flex: "1 1 auto",
      };

      if (config.sideImagePosition === "bottom") {
        sidePhotoStyles.order = 1;
      }
    }
  } else {
    rootStyles = {
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr",
    };

    sidePhotoStyles = {
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",
    };

    const [vPos, hPos] = config.contentPositionInBackgroundMode.split("-");

    const map: Record<string, any> = {
      left: "start",
      center: "center",
      right: "end",
      top: "start",
      bottom: "end",
    };

    contentStyles = {
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",
      position: "relative",
      paddingLeft: config.contentHorizontalMarginInBackgroundMode,
      paddingRight: config.contentHorizontalMarginInBackgroundMode,
      paddingTop: config.contentVerticalMarginInBackgroundMode,
      paddingBottom: config.contentVerticalMarginInBackgroundMode,
      alignSelf: map[vPos],
      justifySelf: map[hPos],
    };
  }

  // const placeholderPaddingBottom = aspectRatio ? `${aspectRatio * 100}%` : "auto";

  // For now it can be only on both sides, so we just take left.
  // const snappedToEdge = !!config.edgeLeft;
  // const edgeMargin = config.edgeLeft?.margin ?? 0;

  const edgeLeft = config.edgeLeft;
  const edgeLeftMargin = config.edgeLeftMargin ?? "0px";

  const edgeRight = config.edgeRight;
  const edgeRightMargin = config.edgeRightMargin ?? "0px";

  // If no main image
  if (!mainImageOn) {
    // ... and no background, then offsets don't make sense
    if (config.Background.length === 0) {
      offset.left = "0px";
      offset.right = "0px";
      offset.top = "0px";
      offset.bottom = "0px";
    }

    // If in section (not a card) and section has escaped margins, stack items can never be bigger than container margin
    if (edgeLeft) {
      offset.left = `max(${offset.left}, ${edgeLeftMargin})`;
    }
    if (edgeRight) {
      offset.right = `max(${offset.right}, ${edgeRightMargin})`;
    }
  } else {
    // If main image is top
    if (
      config.sideImagePosition === "top" ||
      config.sideImagePosition === "bottom"
    ) {
      // ... and no background, only top offset makes sense
      // if (config.Background.length === 0) {
      //   offset.left = "0px";
      //   offset.right = "0px";

      /**
       * Following conditions are discussable. Related to https://linear.app/shopstory/issue/SHO-115/2-columns-bottom-margin-auto-responsiveness
       *
       * 1. Obviously, when there is no background there should be no bottom / top margin. It's parent component that should set this margin.
       * 2. Still, very common use case is left / right mode that becomes top on mobile. In such case when on desktop gap between sections was 0, then it easily breaks.
       * 3. In BannerCards this is totally pointless if this margin is not 0. It really breaks so many layouts.
       *
       * The correct solution is hard.
       * 1. Auto should be handled by CONTAINER (like sections wrapper)
       * 2. It should understand that if (1) its adjacent items have 0 gap and (2) on mobile top item becomes "non-stickable" (it has no background and there is no safe space)...
       * 3. then section wrapper should set auto as non-0.
       *
       * Definition: element is "non-stickable at the bottom" when it is design error when this element has 0 bottom margin to the next component.
       *
       * It's quite easy for banner card to produce this information if it's "non-stickable" or not. Non-stickability conditions:
       * 1. In no-image mode it's always non-stickable on all sides.
       * 2. In background mode it's always stickable on all sides.
       * 3. When content has background, it's always stickable (in all modes). Otherwise:
       * 3. In left/right mode it's non-stickable
       * 4. In top mode it's non-stickable at the bottom
       * 5. In bottom mode it's non-stickable at the top.
       *
       *  But it's still tricky because how parent get this information? Problem:
       *  1. Parent (sections wrapper) must be compiled in order to know what context variables pass to children (banner cards)
       *  2. Children are compiled later, and only then there is information about stickable / non-stickable.
       *  3. Parent is already compiled. Recompilation could possibly lead to new context variables which might lead to infinite recursion :|
       *
       *  It's definitely solvable but also complex and we must postpone it for now.
       *
       *  DECISION AT THE TIME BEING:
       *
       *  For now we can give up setting this bottom margin to 0.
       *  1. It's bad because layout is bad and it's not really REUSABLE.
       *  2. It's good because auto is not fucked up. Correct auto is actually more important.
       *
       */
      // if (config.sideImagePosition === "top") {
      //   offset.bottom = 0;
      // } else if (config.sideImagePosition === "bottom") {
      //   offset.top = 0;
      // }
      // }

      // If in section (not a card) and section has escaped margins, stack items can never be bigger than container margin
      if (edgeLeft) {
        offset.left = `max(${offset.left},${edgeLeftMargin})`;
      }
      if (edgeRight) {
        offset.right = `max(${offset.right},${edgeRightMargin})`;
      }
    } else if (
      config.sideImagePosition === "left" ||
      config.sideImagePosition === "right"
    ) {
      if (config.Background.length === 0) {
        offset.top = "0px";
        offset.bottom = "0px";
      }

      if (
        config.Background.length === 0 ||
        edgeLeft ||
        edgeRight /* escape even with background leads to the same stuff */
      ) {
        /**
         * SideImage on right:
         *
         * 1. NO ESCAPE / position right -> offset right = offH, offset left = 0
         * 2. NO ESCAPE / position center -> offset left+right = offH (not sure about that)
         * 3. NO ESCAPE / position left -> offset right = offH, offset left = 0;
         * 4. ESCAPE / position right -> offset right = offH, offset left = max(offH, margin)
         * 5. ESCAPE / position center -> offset left+right = max(offH, margin)
         * 6. ESCAPE / position left -> offset right = offH, offset left = max(offH, margin)
         */

        const imagePos = config.sideImagePosition;
        const contentPos =
          config.sideImagePosition === "right" ? "left" : "right";

        let isContentSnappedOnItsSide = false;
        let edgeMargin;

        if (contentPos === "left") {
          isContentSnappedOnItsSide = !!edgeLeft;
          edgeMargin = edgeLeftMargin;
        }

        if (contentPos === "right") {
          isContentSnappedOnItsSide = !!edgeRight;
          edgeMargin = edgeRightMargin;
        }

        // snappedToEdge.includes(contentPos);

        const hasBackground = config.Background.length > 0;

        // If has content has background and is *not* snapped on its side, we don't do anything
        // eslint-disable-next-line no-empty
        if (!isContentSnappedOnItsSide && hasBackground) {
        }
        // Not snapped on its side but no background
        else if (!isContentSnappedOnItsSide && !hasBackground) {
          // if (snappedToEdge === "no") { // if *not* snapped on the content side
          if (posH === imagePos) {
            offset[contentPos] = "0px";
          } else if (posH === contentPos) {
            offset[contentPos] = "0px";
          }
        }
        // Snapped on its side, doesn't matter if has background or not
        else {
          if (posH === imagePos) {
            offset[contentPos] = `max(${offset[contentPos]}, ${edgeMargin})`;
          } else if (posH === "center") {
            offset[contentPos] = `max(${offset[contentPos]}, ${edgeMargin})`;
            offset[imagePos] = `max(${offset[imagePos]}, ${edgeMargin})`;
          } else {
            offset[contentPos] = `max(${offset[contentPos]}, ${edgeMargin})`;
          }
        }
      }
    } else if (config.sideImagePosition === "background") {
      if (config.Background.length === 0) {
        offset.top = "0px";
        offset.bottom = "0px";
        offset.left = "0px";
        offset.right = "0px";
      }

      if (edgeLeft) {
        contentStyles.paddingLeft = `max(${contentStyles.paddingLeft}, ${edgeLeftMargin})`;
      }

      if (edgeRight) {
        contentStyles.paddingRight = `max(${contentStyles.paddingRight}, ${edgeRightMargin})`;
      }
    }
  }

  /**
   * shouldActivateCardLink conditions below:
   *
   * If BannerCard is a link, then we want entire banner to be a link AND we want buttons / links inside to work properly.
   * How do we do this?
   * 1. We set pointerEvents to "none" to entire container.
   * 2. We set pointerEvents of global link to pointerEvents: "auto"
   * 3. ButtonGroup has forced pointerEvents: auto"
   * 4. When isEditing, we hide global link and don't do any pointerEvents stuff. It's because if we did, editing wouldn't work properly.
   *
   */

  const shouldActivateCardLink = !isEditing && config.action.length > 0;

  return {
    Container: box({
      position: "relative",
      width: "100%",
      borderRadius: cornerRadius + "px",
      overflow: "hidden",
      pointerEvents: shouldActivateCardLink ? "none" : "auto",
      ...rootStyles,
    }),

    Link: box({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0,
      cursor: "pointer",

      display: shouldActivateCardLink ? "block" : "none",
      pointerEvents: shouldActivateCardLink ? "auto" : "none",
      __action: "action",
    }),

    SidePhotoContainer: box({
      // display: mainImageOn ? "block" : "none",
      // flex: sidePhotoFlex,
      // order: sidePhotoOrder,
      ...sidePhotoStyles,
      position: "relative",
      display: "grid",
    }),
    SideImage: {
      // fitH: true,

      // noInline: true,
      passedAspectRatio: config.sideImageSize,
      gridBaseLineHeight: config.gridBaseLineHeight, // TODO: remove this prop drill :(
      noAction: true,
      noAspectRatio: true,
    },

    ContentContainer: box({
      display: "grid",
      ...contentStyles,
    }),

    BackgroundContainer: box({
      position: "relative",
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",
      display: "grid",
    }),

    Background: {
      // noInline: true,
      passedAspectRatio: backgroundAspectRatio,
      gridBaseLineHeight: config.gridBaseLineHeight, // TODO: remove this prop drill :(
      noAction: true,
    },

    Stack: {
      // noInline: true,
      paddingLeft: offset.left,
      paddingRight: offset.right,
      paddingBottom: offset.bottom,
      paddingTop: offset.top,
      passedAlign: config.stackAlign,
      $width: $stackWidth,
      $widthAuto: true,
    },

    StackContainer: box({
      gridColumn: "1 / span 1",
      gridRow: stackContainerGridRow,

      display: "flex",
      justifyContent: flexPosH,
      alignItems: flexPosV,
    }),

    StackInnerContainer: box({
      position: "relative",
      width: "auto",
      maxWidth: "100%",
    }),

    TextOuterContainer: box({
      display: "flex",
      justifyContent: flexPosH,
      alignItems: flexPosV,
      height: "100%",
    }),

    TextContainer: box({
      position: "relative",
      maxWidth: "auto",
      // width: stackWidth
    }),

    BackgroundOuterContainer: box({}),
  };
}

export default styles;

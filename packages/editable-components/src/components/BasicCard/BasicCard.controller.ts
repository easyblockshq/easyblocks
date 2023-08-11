import { BasicCardCompiledValues } from "./BasicCard.types";
import { getEdgeValues } from "../../getEdgeValues";

type PaddingType = "internal" | "external" | null;

export type PaddingFieldsSeparate = { start: PaddingType; end: PaddingType };
export type PaddingFieldsSame = { both: PaddingType };

export type PaddingFields = {
  horizontal: PaddingFieldsSeparate | PaddingFieldsSame;
  vertical: PaddingFieldsSeparate | PaddingFieldsSame;
};

export function arePaddingFieldsSeparate(
  arg: PaddingFieldsSeparate | PaddingFieldsSame
): arg is PaddingFieldsSeparate {
  return (arg as any).start !== undefined && (arg as any).end !== undefined;
}

function getBiggerPaddingType(
  input1: PaddingType,
  input2: PaddingType
): PaddingType {
  if (input1 === "internal" || input2 === "internal") {
    return "internal";
  } else if (input1 === "external" || input2 === "external") {
    return "external";
  }
  return null;
}

export function calculatePaddings(input: {
  startPaddingType: PaddingType;
  endPaddingType: PaddingType;
  values: {
    startPadding: string;
    startPaddingExternal: string;
    endPadding: string;
    endPaddingExternal: string;
  };
  edge?: {
    snap: boolean;
    start: boolean;
    startMargin: string;
    end: boolean;
    endMargin: string;
  };
  isCentered: boolean;
}): {
  startPadding: string;
  endPadding: string;
  fields: PaddingFieldsSeparate | PaddingFieldsSame;
} {
  let resultPaddingFields: PaddingFieldsSeparate | PaddingFieldsSame;

  /**
   * Calculate padding fields
   */
  if (!input.edge) {
    if (input.isCentered) {
      resultPaddingFields = {
        both: getBiggerPaddingType(
          input.startPaddingType,
          input.endPaddingType
        ),
      };
    } else {
      resultPaddingFields = {
        start: input.startPaddingType,
        end: input.endPaddingType,
      };
    }
  } else {
    if (input.isCentered) {
      // if no edge, then let's just take more important one (internal > external > null)
      if (!input.edge.start && !input.edge.end) {
        resultPaddingFields = {
          both: getBiggerPaddingType(
            input.startPaddingType,
            input.endPaddingType
          ),
        };
      } else {
        // if at any edge with protection, we must adjust to the container margin forcefully
        if (input.edge.snap) {
          resultPaddingFields = { both: null };
        }
        // if at any edge without protection, then internal wins (it's always internal next to edge)
        else {
          resultPaddingFields = { both: "internal" };
        }
      }
    } else {
      resultPaddingFields = { start: null, end: null };

      if (!input.edge.start) {
        resultPaddingFields.start = input.startPaddingType;
      } else {
        if (input.edge.snap) {
          resultPaddingFields.start = null;
        } else {
          resultPaddingFields.start = "internal"; // always internal in case of edge without protection
        }
      }

      if (!input.edge.end) {
        resultPaddingFields.end = input.endPaddingType;
      } else {
        if (input.edge.snap) {
          resultPaddingFields.end = null;
        } else {
          resultPaddingFields.end = "internal"; // always internal in case of edge without protection
        }
      }
    }
  }

  /**
   * Calculating real paddings
   */

  function getPadding(which: "start" | "end", spec: PaddingType): string {
    if (spec === "internal") {
      return input.values[`${which}Padding`];
    } else if (spec === "external") {
      return input.values[`${which}PaddingExternal`];
    }
    return "0px";
  }

  let startPadding: string;
  let endPadding: string;

  if (!input.edge) {
    if (arePaddingFieldsSeparate(resultPaddingFields)) {
      startPadding = getPadding("start", resultPaddingFields.start);
      endPadding = getPadding("end", resultPaddingFields.end);
    } else {
      startPadding = getPadding("start", resultPaddingFields.both);
      endPadding = startPadding;
    }
  } else {
    if (arePaddingFieldsSeparate(resultPaddingFields)) {
      if (
        input.edge.start &&
        input.edge.snap &&
        resultPaddingFields.start === null
      ) {
        startPadding = input.edge.startMargin;
      } else {
        startPadding = getPadding("start", resultPaddingFields.start);
      }

      if (
        input.edge.end &&
        input.edge.snap &&
        resultPaddingFields.end === null
      ) {
        endPadding = input.edge.endMargin;
      } else {
        endPadding = getPadding("end", resultPaddingFields.end);
      }
    } else {
      if (
        (input.edge.start || input.edge.end) &&
        input.edge.snap &&
        resultPaddingFields.both === null
      ) {
        const margin = `max(${
          input.edge.start ? input.edge.startMargin : "0px"
        },${input.edge.end ? input.edge.endMargin : "0px"})`;
        startPadding = margin;
        endPadding = margin;
      } else {
        startPadding = getPadding("start", resultPaddingFields.both);
        endPadding = startPadding;
      }
    }
  }

  return {
    startPadding,
    endPadding,
    fields: resultPaddingFields,
  };
}

export function basicCardController(config: BasicCardCompiledValues) {
  const position = config.position.split("-");
  const posH = position[1];
  const posV = position[0];

  const isCenteredHorizontally = posH === "center";
  const isCenteredVertically = posV === "center";

  const noBorders = config.passedNoBorders ?? false;

  const hideContent = config.hideContent ?? false;
  const hideBackground = config.hideBackground ?? false;

  const edgeInfo = getEdgeValues(config);

  const shouldUseOnlyInternalPaddings = hideBackground
    ? false
    : hideContent
    ? true
    : config.Background.length > 0;

  let paddingSpec: {
    top: PaddingType;
    bottom: PaddingType;
    left: PaddingType;
    right: PaddingType;
  };

  /**
   * setting padding specs
   */
  if (shouldUseOnlyInternalPaddings) {
    paddingSpec = {
      top: "internal",
      bottom: "internal",
      left: "internal",
      right: "internal",
    };
  } else {
    paddingSpec = {
      top: config.edgeTop
        ? config.useExternalPaddingTop
          ? "external"
          : "internal"
        : null,
      bottom: config.edgeBottom
        ? config.useExternalPaddingBottom
          ? "external"
          : "internal"
        : null,
      left: config.edgeLeft
        ? config.useExternalPaddingLeft
          ? "external"
          : "internal"
        : null,
      right: config.edgeRight
        ? config.useExternalPaddingRight
          ? "external"
          : "internal"
        : null,
    };
  }

  const horizontalResults = calculatePaddings({
    startPaddingType: paddingSpec.left,
    endPaddingType: paddingSpec.right,
    values: {
      startPadding: config.paddingLeft,
      startPaddingExternal: config.paddingLeftExternal,
      endPadding: config.paddingRight,
      endPaddingExternal: config.paddingRightExternal,
    },
    edge: {
      snap: !!config.edgeMarginProtection,
      /**
       * calculatePaddings understand start and startMargin as EDGE-ONLY. Doesn't recognize edgeLeft=true with edgeLeftMargin=null. It's legacy, that's why below we make a little transformation.
       */
      start: edgeInfo.edgeLeft && edgeInfo.edgeLeftMargin !== null,
      startMargin: edgeInfo.edgeLeftMargin ?? "0px",
      end: edgeInfo.edgeRight && edgeInfo.edgeRightMargin !== null,
      endMargin: edgeInfo.edgeRightMargin ?? "0px",
    },
    isCentered: isCenteredHorizontally,
  });

  const verticalResults = calculatePaddings({
    startPaddingType: paddingSpec.top,
    endPaddingType: paddingSpec.bottom,
    values: {
      startPadding: config.paddingTop,
      startPaddingExternal: config.paddingTopExternal,
      endPadding: config.paddingBottom,
      endPaddingExternal: config.paddingBottomExternal,
    },
    isCentered: isCenteredVertically,
  });

  const resultPaddingFields = {
    vertical: verticalResults.fields,
    horizontal: horizontalResults.fields,
  };

  const resultPadding = {
    top: verticalResults.startPadding,
    bottom: verticalResults.endPadding,
    left: horizontalResults.startPadding,
    right: horizontalResults.endPadding,
  };

  const shouldUsePassedSize =
    config.passedSize !== undefined && config.passedSize !== "auto";
  const size = shouldUsePassedSize ? config.passedSize : config.size;
  const backgroundAspectRatio =
    size === "fit-background"
      ? "natural"
      : size === "fit-content"
      ? "none"
      : size;

  return {
    padding: resultPadding,
    paddingFields: resultPaddingFields,
    posH,
    posV,
    hideContent,
    hideBackground,
    enableContent: config.enableContent,
    noBorders,
    ignoreSize: shouldUsePassedSize,
    backgroundAspectRatio,
  };
}

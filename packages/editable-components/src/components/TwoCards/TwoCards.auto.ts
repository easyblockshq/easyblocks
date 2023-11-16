import {
  getDevicesWidths,
  responsiveValueGetDefinedValue,
} from "@easyblocks/app-utils";
import { NoCodeComponentAutoFunctionInput } from "@easyblocks/core";
import { DecomposedValues } from "../../decomposeValues";
import { ResponsiveAutoCallback, responsiveAuto } from "../../responsiveAuto";
import { TWO_CARDS_COL_NUM } from "./twoCardsConstants";

function calculateWidthsFromNonRoundedGap(
  autoGapNotRounded: number,
  higherCard1Width: number,
  higherCard2Width: number
) {
  if (autoGapNotRounded < 1 && higherCard1Width > 0 && higherCard2Width > 0) {
    autoGapNotRounded = 1;
  }
  if (autoGapNotRounded > 20) {
    autoGapNotRounded = 20;
  }

  let autoGap = Math.round(autoGapNotRounded);
  const autoGapCeil = Math.ceil(autoGapNotRounded);
  const autoGapFloor = Math.floor(autoGapNotRounded);

  // If at higher breakpoint cards were equal width, they must be equal width in auto mode, so odd auto gap must be corrected
  if (higherCard1Width === higherCard2Width && autoGap % 2 === 1) {
    if (autoGapCeil % 2 === 0) {
      autoGap = autoGapCeil;
    } else if (autoGapFloor % 2 === 0) {
      autoGap = autoGapFloor;
    } else if (autoGap === 1) {
      autoGap = 2;
    } else {
      autoGap = autoGap - 1;
    }

    if (autoGap % 2 === 1) {
      throw new Error("can't happen");
    }
  }

  const roundingFunction =
    higherCard1Width > higherCard2Width ? Math.floor : Math.ceil;
  const autoCard1Width = roundingFunction(
    (TWO_CARDS_COL_NUM - autoGap) *
      (higherCard1Width / (higherCard1Width + higherCard2Width))
  );
  const autoCard2Width = TWO_CARDS_COL_NUM - autoCard1Width - autoGap;

  return [autoCard1Width, autoCard2Width];
}

function calculateAutoWidths(
  higherCard1Width: number,
  higherCard2Width: number,
  higherWidth: number,
  currentWidth: number,
  magicNumber?: number
) {
  const MAGIC_NUMBER = magicNumber ?? -0.45;

  const higherGap = TWO_CARDS_COL_NUM - higherCard1Width - higherCard2Width;

  if (higherGap === 0) {
    return [higherCard1Width, higherCard2Width];
  }

  // For vertical mobile phones we always apply fullscreen!
  if (
    (higherCard1Width === 0 || higherCard2Width === 0) &&
    currentWidth < 568
  ) {
    return [TWO_CARDS_COL_NUM, TWO_CARDS_COL_NUM];
  }

  const autoGapNotRounded =
    TWO_CARDS_COL_NUM *
    Math.max(
      0,
      higherGap / TWO_CARDS_COL_NUM +
        (1 - currentWidth / higherWidth) * MAGIC_NUMBER
    );

  return calculateWidthsFromNonRoundedGap(
    autoGapNotRounded,
    higherCard1Width,
    higherCard2Width
  );
}

function calculateAutoWidthsForBetweenMode(
  card1WidthHigher: number,
  card2WidthHigher: number,
  card1WidthLower: number,
  card2WidthLower: number,
  higherWidth: number,
  lowerWidth: number,
  currentWidth: number
) {
  let autoCard1Width: number;
  let autoCard2Width: number;

  const resolutionProportion =
    (currentWidth - lowerWidth) / (higherWidth - lowerWidth); // If lower is 1000, higher 1600 and device 1200, then we have 200 / 600 = 0.33. For lower it's 0, for higher it's 1. It's always 0-1.

  autoCard1Width = Math.round(
    card1WidthLower +
      (card1WidthHigher - card1WidthLower) * resolutionProportion
  );
  autoCard2Width = Math.round(
    card2WidthLower +
      (card2WidthHigher - card2WidthLower) * resolutionProportion
  );

  if (autoCard1Width + autoCard2Width === 25) {
    if (autoCard2Width >= autoCard1Width) {
      autoCard2Width--;
    } else {
      autoCard1Width--;
    }
  }
  return [autoCard1Width, autoCard2Width];
}

function autoCollapse({
  values,
  higherDefinedValues,
  lowerDefinedValues,
  closestDefinedValues,
  width,
}: DecomposedValues): Record<string, any> {
  let collapse = values.collapse;

  /**
   * COLLAPSE
   */
  if (collapse === undefined) {
    if (
      higherDefinedValues.collapse &&
      higherDefinedValues.collapse.value === false
    ) {
      if (
        (lowerDefinedValues.collapse &&
          lowerDefinedValues.collapse.value === true) ||
        !lowerDefinedValues.collapse
      ) {
        // if higher is non-collapsed and lower potentially collapsed
        collapse = higherDefinedValues.collapse.width > width * 2; // collapse if size decreased at least twice
      }
    } else {
      collapse = closestDefinedValues.collapse.value;
    }
  }

  return {
    collapse,
  };
}

function autoWidths({
  values,
  higherDefinedValues,
  lowerDefinedValues,
  closestDefinedValues,
  width,
}: DecomposedValues): Record<string, any> {
  /**
   * widths and gap
   */
  let card1Width = values.card1Width;
  let card2Width = values.card2Width;

  if (card1Width !== undefined && card2Width !== undefined) {
    /* values defined */
  } else if (
    (card1Width === undefined && card2Width !== undefined) ||
    (card1Width !== undefined && card2Width === undefined)
  ) {
    throw new Error(
      "this is error situation. card1Width and card2Width are both either defined or not defined"
    );
  } else {
    const card1WidthHigher = higherDefinedValues.card1Width
      ? parseInt(higherDefinedValues.card1Width.value)
      : undefined;
    const card1WidthLower = lowerDefinedValues.card1Width
      ? parseInt(lowerDefinedValues.card1Width.value)
      : undefined;
    const card2WidthHigher = higherDefinedValues.card2Width
      ? parseInt(higherDefinedValues.card2Width.value)
      : undefined;
    const card2WidthLower = lowerDefinedValues.card2Width
      ? parseInt(lowerDefinedValues.card2Width.value)
      : undefined;

    if (card1WidthHigher === undefined || card2WidthHigher === undefined) {
      // If we are on the breakpoint that has only lower values defined, then we just take defaults.
      card1Width = closestDefinedValues.card1Width.value;
      card2Width = closestDefinedValues.card2Width.value;
    } else {
      let autoCard1Width;
      let autoCard2Width;

      const higherDefinedWidth = higherDefinedValues.card1Width.width;

      const isBetween2DefinedValues =
        card1WidthHigher !== undefined && card1WidthLower !== undefined;

      // const collapse =
      //   responsiveValueGet(config.collapse, device.id, devices) === true;

      // If we're in collapsed mode
      // console.log('values collaspe value!', values.collapse.value);

      if (closestDefinedValues.collapse.value === true) {
        if (isBetween2DefinedValues) {
          const lowerDefinedWidth = lowerDefinedValues.card1Width.width;

          [autoCard1Width] = calculateAutoWidthsForBetweenMode(
            card1WidthHigher,
            0,
            card1WidthLower,
            0,
            higherDefinedWidth,
            lowerDefinedWidth,
            width
          );
          [, autoCard2Width] = calculateAutoWidthsForBetweenMode(
            0,
            card2WidthHigher!,
            0,
            card2WidthLower!,
            higherDefinedWidth,
            lowerDefinedWidth,
            width
          );
        } else {
          // If it's not irregular layout always make full size on mobile
          if (card1WidthHigher + card2WidthHigher === TWO_CARDS_COL_NUM) {
            autoCard1Width = TWO_CARDS_COL_NUM;
            autoCard2Width = TWO_CARDS_COL_NUM;
          } else {
            [autoCard1Width] = calculateAutoWidths(
              card1WidthHigher,
              0,
              higherDefinedWidth,
              width,
              -0.8
            );
            [, autoCard2Width] = calculateAutoWidths(
              0,
              card2WidthHigher,
              higherDefinedWidth,
              width,
              -0.8
            );
          }
        }
      } else {
        if (isBetween2DefinedValues) {
          const lowerDefinedWidth = lowerDefinedValues.card1Width.width;

          [autoCard1Width, autoCard2Width] = calculateAutoWidthsForBetweenMode(
            card1WidthHigher,
            card2WidthHigher!,
            card1WidthLower,
            card2WidthLower!,
            higherDefinedWidth,
            lowerDefinedWidth,
            width
          );
        } else {
          [autoCard1Width, autoCard2Width] = calculateAutoWidths(
            card1WidthHigher,
            card2WidthHigher,
            higherDefinedWidth,
            width
          );
        }
      }

      card1Width = autoCard1Width.toString();
      card2Width = autoCard2Width.toString();
    }
  }

  return {
    card1Width,
    card2Width,
  };
}

const autoVerticalOffset: ResponsiveAutoCallback = ({
  values,
  closestDefinedValues,
  width,
}) => {
  let verticalOffset = values.verticalOffset;

  if (verticalOffset === undefined) {
    // const currentGap =
    //   TWO_CARDS_COL_NUM -
    //   parseInt(closestDefinedValues.card1Width.value) -
    //   parseInt(closestDefinedValues.card2Width.value);

    // const deviceId = closestDefinedValues.verticalOffset.device.id;
    //
    // const gapForClosestDefinedVerticalOffset =
    //   TWO_CARDS_COL_NUM -
    //   parseInt(config.card1Width[deviceId]) -
    //   parseInt(config.card2Width[deviceId]);

    const closestDefinedVerticalOffsetValue = parseInt(
      closestDefinedValues.verticalOffset.value
    );

    verticalOffset = Math.ceil(
      (width / closestDefinedValues.verticalOffset.width) *
        closestDefinedVerticalOffsetValue *
        1.5 // this very simple heuristic actually works quite well
    );
  }

  return {
    verticalOffset,
  };
};

const autoVerticalGap: ResponsiveAutoCallback = (
  { values, higherDefinedValues, lowerDefinedValues, closestDefinedValues },
  { config, devices, widths }
) => {
  let verticalGap = values.verticalGap;

  if (verticalGap === undefined) {
    // if closest higher defined vertical gap is for collapse = true, then let's do nothing, it will be used anyway
    if (
      higherDefinedValues.verticalGap &&
      config.collapse[higherDefinedValues.verticalGap.device.id] === true
    ) {
      // nothing, keep undefined
    }
    // if closest lower defined vertical gap is for collapse = true, then let's take it, it's more important than higher defined for collapse = false, MODES!!!
    else if (
      lowerDefinedValues.verticalGap &&
      config.collapse[lowerDefinedValues.verticalGap.device.id] === true
    ) {
      verticalGap = lowerDefinedValues.verticalGap.value;
    }
    // otherwise it means closest defined vertical gap is for collapse = false. Let's take "gap" only if sum of widths is 24.
    else {
      // now we know that closest is only collapse = false
      const closestDefinedVerticalGapDevice =
        closestDefinedValues.verticalGap.device;
      const closestDefinedGap =
        TWO_CARDS_COL_NUM -
        parseInt(config.card1Width[closestDefinedVerticalGapDevice.id]) -
        parseInt(config.card2Width[closestDefinedVerticalGapDevice.id]);

      if (closestDefinedGap === 0) {
        verticalGap = responsiveValueGetDefinedValue(
          config.gap,
          closestDefinedVerticalGapDevice.id,
          devices,
          widths
        );
      }
    }
  }

  return {
    verticalGap,
  };
};

export function twoCardsAuto({
  values: inputValues,
  params,
  devices,
}: NoCodeComponentAutoFunctionInput): Record<string, any> {
  const widths = getDevicesWidths(devices);

  let values = responsiveAuto(
    { ...inputValues, ...params },
    devices,
    widths,
    autoCollapse
  );
  values = responsiveAuto(values, devices, widths, autoWidths);
  values = responsiveAuto(values, devices, widths, autoVerticalOffset);
  values = responsiveAuto(values, devices, widths, autoVerticalGap);

  return values;
}

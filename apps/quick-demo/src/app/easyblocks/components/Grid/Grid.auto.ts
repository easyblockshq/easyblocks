import {
  DeviceRange,
  Devices,
  NoCodeComponentAutoFunction,
  TrulyResponsiveValue,
  responsiveValueForceGet,
  responsiveValueGet,
  responsiveValueGetDefinedValue,
  responsiveValueMap,
  responsiveValueFlatten,
  spacingToPx,
} from "@easyblocks/core";

import { responsiveAuto } from "../utils/responsiveAuto";
import { sectionWrapperCalculateMarginAndMaxWidth } from "@/app/easyblocks/components/utils/sectionWrapper";

function calculateContainerWidth(
  config: Record<string, any>,
  device: DeviceRange,
  devices: Devices,
  widths: TrulyResponsiveValue<number>
) {
  const edgeMargin: string =
    responsiveValueGetDefinedValue(
      config.edgeMargin,
      device.id,
      devices,
      widths
    ) ?? "0px";
  const snappedToEdge =
    responsiveValueGetDefinedValue(
      config.snappedToEdge,
      device.id,
      devices,
      widths
    ) ?? 0;
  const width = responsiveValueForceGet(widths, device.id);

  if (snappedToEdge) {
    return width;
  }

  return width - 2 * spacingToPx(edgeMargin, device.w);
}

const MAGIC_NUMBER = 1;

export const gridAuto: NoCodeComponentAutoFunction<any, any> = ({
  values,
  params,
  devices,
}) => {
  /**
   * We start with calculating widths. Widths is a responsive value that is a "real" width of grid container (without margins).
   * It takes into account margins, margin escape and max width.
   *
   * It's important because auto function is built with respect to those "real widths".
   *
   * Why?
   *
   * Imagine situation when screen width is 1600px and grid is only 800px wide and margins on left and right are 400px.
   * When we switch screen to 1000px it's highly possible that the grid will still be 800px wide but the screen resolution changed a lot.
   * In such case auto shouldn't switch for example 4-column grid to 2-column grid. It should stay 4-column.
   * If we calculated auto based on screen width (params.$width) the behaviour would be incorrect.
   *
   */
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

  /**
   * shouldSliderItemsBeVisibleOnMargin
   */

  let valuesAfterAuto = responsiveAuto(
    { ...values, ...params },
    devices,
    widths,
    ({ values, closestDefinedValues }, { device }) => {
      let shouldSliderItemsBeVisibleOnMargin =
        values.shouldSliderItemsBeVisibleOnMargin;
      if (shouldSliderItemsBeVisibleOnMargin === undefined) {
        shouldSliderItemsBeVisibleOnMargin =
          device.id === "xs"
            ? true
            : closestDefinedValues.shouldSliderItemsBeVisibleOnMargin.value;
      }

      return {
        shouldSliderItemsBeVisibleOnMargin,
      };
    }
  );

  /**
   * NUMBER OF ITEMS / FRACTIONAL ITEM WIDTH
   */

  let maxNumberOfItems = 0;
  devices.forEach((device) => {
    const numberOfItems = responsiveValueGet(values.numberOfItems, device.id);

    if (numberOfItems !== undefined) {
      maxNumberOfItems = Math.max(maxNumberOfItems, parseInt(numberOfItems));
    }
  });

  valuesAfterAuto = responsiveAuto(
    valuesAfterAuto,
    devices,
    widths,
    (
      {
        values,
        higherDefinedValues,
        lowerDefinedValues,
        closestDefinedValues,
        width,
      },
      { config, widths, device }
    ) => {
      if (values.numberOfItems !== undefined) {
        if (device.id === "xs" && values.fractionalItemWidth === undefined) {
          return {
            numberOfItems: values.numberOfItems,
            fractionalItemWidth:
              config.Cards.length <= parseInt(values.numberOfItems)
                ? "1"
                : "1.25",
          };
        }
        return {
          numberOfItems: values.numberOfItems,
          fractionalItemWidth: closestDefinedValues.fractionalItemWidth.value,
        };
      }

      if (!higherDefinedValues.numberOfItems) {
        return {
          numberOfItems: closestDefinedValues.numberOfItems.value,
          fractionalItemWidth: closestDefinedValues.fractionalItemWidth.value,
        };
      }

      let minNumberOfItems = lowerDefinedValues.numberOfItems
        ? parseInt(lowerDefinedValues.numberOfItems.value)
        : 1;
      const maxNumberOfItems = parseInt(
        higherDefinedValues.numberOfItems.value
      );
      const variant = closestDefinedValues.variant.value;

      /**
       * Below there's a very simple check to prevent showing 1-item grid too soon.
       */

      // We could make this condition more generic
      if (maxNumberOfItems === 1) {
        minNumberOfItems = 1;
      } else if (
        variant === "grid" ||
        (variant === "slider" && device.id !== "xs")
      ) {
        /**
         * This condition is super important.
         *
         * The switch from grid with 2 items into grid with 1 item is usually unwanted. It looks bad.
         * However, if someone creates 2 absolutely HUGE items then we should still switch them to one under another.
         * Here we make a decision when do we allow for 1 or 2 minimum.
         */
        const higherWidth = higherDefinedValues.numberOfItems.width;
        const higherNumberOfItems = parseInt(
          higherDefinedValues.numberOfItems.value
        );
        const higherItemWidth = higherWidth / higherNumberOfItems;
        const current2ItemsWidth = width / 2;

        // don't allow for switch from 2 to 1 until item is 2.5x smaller (huge difference). Switching from 2 to 1 is usually very unwanted.
        if (
          higherNumberOfItems === 2 &&
          current2ItemsWidth * 2.5 > higherItemWidth
        ) {
          minNumberOfItems = 2;
        }
        // don't allow for switch when on higher breakpoint there are > 4
        else if (higherNumberOfItems >= 4) {
          minNumberOfItems = 2;
        }
      }

      const containerWidth = calculateContainerWidth(
        config,
        device,
        devices,
        widths
      );

      let bestNum = minNumberOfItems;
      let bestFraction = 0;
      let bestXFactor = 99999;

      const pairs: Array<{ numberOfItems: number; fraction: number }> = [];

      for (let num = minNumberOfItems; num <= maxNumberOfItems; num++) {
        if (device.id !== "xs") {
          pairs.push({
            numberOfItems: num,
            fraction: 0,
          });
        } else {
          const currentFraction = values.fractionalItemWidth;

          if (currentFraction !== undefined) {
            pairs.push({
              numberOfItems: num,
              fraction: parseFloat(currentFraction) - 1,
            });
          } else {
            pairs.push({
              numberOfItems: num,
              fraction: 0.25,
            });
          }
        }
      }

      pairs.forEach((pair) => {
        const num = pair.numberOfItems + pair.fraction;

        const higherNumberOfItems = parseInt(
          higherDefinedValues.numberOfItems.value
        );
        const higherIsRow = higherNumberOfItems <= config.Cards.length;
        const higherContainerWidth = calculateContainerWidth(
          config,
          higherDefinedValues.numberOfItems.device,
          devices,
          widths
        );
        const higherItemWidth = higherContainerWidth / higherNumberOfItems;

        // If last defined value is a row and now we're having a grid, we can't do the layout that has "empty spaces". Unless when lastDefinedCount is 4 or less
        if (higherIsRow && variant === "grid" && higherNumberOfItems <= 4) {
          // If we start with a row
          if (config.Cards.length % num !== 0) {
            return;
          }
        }

        // If slider with n items when n >= 2, then we can't show n - 1 items. That would be odd.
        if (variant === "slider") {
          if (num === config.Cards.length - 1 && num >= 3) {
            return;
          }
        }

        const itemWidth = containerWidth / num;
        const P = itemWidth / higherItemWidth; // proportion
        const xfactor = P >= 1 ? P : MAGIC_NUMBER * (1 / P);

        if (xfactor < bestXFactor) {
          bestNum = pair.numberOfItems;
          bestFraction = pair.fraction;
          bestXFactor = xfactor;
        }
      });

      if (bestNum >= config.Cards.length) {
        bestFraction = 0;
      }

      return {
        numberOfItems: bestNum.toString(),
        fractionalItemWidth: (bestFraction + 1).toString(),
      };
    }
  );

  return valuesAfterAuto;
};

import {
  AutoFunction,
  getDevicesWidths,
  responsiveValueFill,
  responsiveValueForceGet,
  responsiveValueGetDefinedValue,
  scalarizeConfig,
  spacingToPx,
} from "@easyblocks/app-utils";
import { DeviceRange, Devices, TrulyResponsiveValue } from "@easyblocks/core";
import { responsiveAuto } from "../../responsiveAuto";
import { gridContainerController } from "./Grid.controller";

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
  const width = widths[device.id]! as number;

  if (snappedToEdge) {
    return width;
  }

  return width - 2 * spacingToPx(edgeMargin, device.w);
}

const MAGIC_NUMBER = 1;

export const gridAuto: AutoFunction = (
  config,
  compilationContext,
  inputWidths
) => {
  const devices = compilationContext.devices;

  // Auto should be done relative to real container widths but Grid also have container margins inside.
  const widths: TrulyResponsiveValue<number> = { $res: true };

  devices.forEach((device) => {
    const scalarizedContainerProps = scalarizeConfig(
      {
        edgeLeftMargin: responsiveValueFill(
          config.edgeLeftMargin,
          devices,
          getDevicesWidths(devices)
        ),
        edgeRightMargin: responsiveValueFill(
          config.edgeRightMargin,
          devices,
          getDevicesWidths(devices)
        ),
        escapeMargin: responsiveValueFill(
          config.escapeMargin,
          devices,
          getDevicesWidths(devices)
        ),
        maxWidth: responsiveValueFill(
          config.maxWidth,
          devices,
          getDevicesWidths(devices)
        ),
      },
      device.id,
      devices,
      []
    );
    const { realWidth } = gridContainerController(
      scalarizedContainerProps,
      responsiveValueForceGet(inputWidths, device.id),
      device
    );
    widths[device.id] = realWidth;
  });

  let values = responsiveAuto(
    config,
    compilationContext,
    widths,
    (
      {
        values,
        higherDefinedValues,
        lowerDefinedValues,
        closestDefinedValues,
        width,
      },
      { config, compilationContext, widths, device }
    ) => {
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
    const numberOfItems = config.numberOfItems[device.id];
    if (numberOfItems !== undefined) {
      maxNumberOfItems = Math.max(maxNumberOfItems, parseInt(numberOfItems));
    }
  });

  values = responsiveAuto(
    values,
    compilationContext,
    widths,
    (
      {
        values,
        higherDefinedValues,
        lowerDefinedValues,
        closestDefinedValues,
        width,
      },
      { config, compilationContext, widths, device }
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

  // for (const prop in values) {
  //   if (isTrulyResponsiveValue(values[prop])) {
  //     values[prop] = responsiveValueNormalize(
  //       values[prop],
  //       compilationContext.devices
  //     );
  //   }
  // }

  return values;
};

import { getDevicesWidths } from "@easyblocks/app-utils";
import { NoCodeComponentAutoFunction } from "@easyblocks/core";
import { responsiveAuto } from "../../responsiveAuto";

export const bannerCardAuto: NoCodeComponentAutoFunction = ({
  values,
  params,
  devices,
}): Record<string, any> => {
  const widths = getDevicesWidths(devices);

  const valuesAfterAuto = responsiveAuto(
    { ...values, ...params },
    devices,
    widths,
    ({
      values,
      higherDefinedValues,
      lowerDefinedValues,
      closestDefinedValues,
      width,
    }) => {
      let sideImagePosition = values.sideImagePosition;

      if (sideImagePosition === undefined) {
        /**
         * The only thing we do here is switch from side mode to top mode only when all of those occur:
         * - higher defined is side-by-side
         * - higher defined width is 2x higher
         * - lower defined is not side-by-side
         */

        const higherMode = higherDefinedValues.sideImagePosition;
        const lowerMode = lowerDefinedValues.sideImagePosition;

        if (
          higherMode &&
          (higherMode.value === "left" || higherMode.value === "right") &&
          higherMode.width / 2 > width &&
          (!lowerMode ||
            (lowerMode.value !== "left" && lowerMode.value !== "right"))
        ) {
          sideImagePosition = "top";
        } else {
          sideImagePosition = closestDefinedValues.sideImagePosition.value;
        }
      }

      return {
        sideImagePosition,
      };
    }
  );

  return valuesAfterAuto;
};

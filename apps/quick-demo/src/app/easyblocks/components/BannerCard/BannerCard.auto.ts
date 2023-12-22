import { NoCodeComponentAutoFunction } from "@easyblocks/core";
import { getDevicesWidths } from "@easyblocks/core/_internals";
import { responsiveAuto } from "@/app/easyblocks/components/utils/responsiveAuto";

export const bannerCardAuto: NoCodeComponentAutoFunction = ({
  values,
  params,
  devices,
}) => {
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
      let mode = values.mode;

      if (mode === undefined) {
        /**
         * The only thing we do here is switch from side mode to top mode only when all of those occur:
         * - higher defined is side-by-side
         * - higher defined width is 2x higher
         * - lower defined is not side-by-side
         */

        const higherMode = higherDefinedValues.mode;
        const lowerMode = lowerDefinedValues.mode;

        if (
          higherMode &&
          (higherMode.value === "left" || higherMode.value === "right") &&
          higherMode.width / 2 > width &&
          (!lowerMode ||
            (lowerMode.value !== "left" && lowerMode.value !== "right"))
        ) {
          mode = "top";
        } else {
          mode = closestDefinedValues.mode.value;
        }
      }

      return {
        mode,
      };
    }
  );

  return valuesAfterAuto;
};

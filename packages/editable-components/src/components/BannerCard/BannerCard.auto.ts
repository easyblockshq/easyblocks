import { AutoFunction } from "@easyblocks/app-utils";
import { responsiveAuto } from "../../responsiveAuto";

export const bannerCardAuto: AutoFunction = (
  config,
  compilationContext,
  widths
): Record<string, any> => {
  const values = responsiveAuto(
    config,
    compilationContext,
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

  return values;
};

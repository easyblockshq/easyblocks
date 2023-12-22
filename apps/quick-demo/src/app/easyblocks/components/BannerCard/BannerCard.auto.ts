import { NoCodeComponentAutoFunction } from "@easyblocks/core";
import { responsiveAuto } from "@/app/easyblocks/components/utils/responsiveAuto";

export const bannerCardAuto: NoCodeComponentAutoFunction = ({
  values,
  params,
  devices,
}) => {
  const valuesAfterAuto = responsiveAuto(
    values,
    devices,
    params.$width,
    ({
      values,
      higherDefinedValues,
      lowerDefinedValues,
      closestDefinedValues,
      width,
    }) => {
      let coverPosition = values.coverPosition;

      if (coverPosition === undefined) {
        /**
         * The only thing we do here is switch from side mode to top mode only when all of those occur:
         * - higher defined is side-by-side
         * - higher defined width is 2x higher
         * - lower defined is not side-by-side
         */

        const higherValue = higherDefinedValues.coverPosition;
        const lowerValue = lowerDefinedValues.coverPosition;

        if (
          higherValue &&
          (higherValue.value === "left" || higherValue.value === "right") &&
          higherValue.width / 2 > width &&
          (!lowerValue ||
            (lowerValue.value !== "left" && lowerValue.value !== "right"))
        ) {
          coverPosition = "top";
        } else {
          coverPosition = closestDefinedValues.coverPosition.value;
        }
      }

      return {
        coverPosition,
      };
    }
  );

  return valuesAfterAuto;
};

import { NoCodeComponentChangeFunction } from "@easyblocks/core";
import { TWO_CARDS_COL_NUM } from "./twoCardsConstants";

type WidthRelatedValues = {
  card1Width: string;
  card2Width: string;
  collapse: boolean;
};

function correctCardWidths(
  values: WidthRelatedValues,
  fixedWidthField: "card1Width" | "card2Width"
): WidthRelatedValues {
  const ret: WidthRelatedValues = { ...values };

  // if collapsed, do nothing
  if (values.collapse) {
    return values;
  }

  const sum = parseInt(values.card1Width) + parseInt(values.card2Width);
  if (sum > TWO_CARDS_COL_NUM) {
    const variableWidthField =
      fixedWidthField === "card1Width" ? "card2Width" : "card1Width";
    ret[variableWidthField] = (
      TWO_CARDS_COL_NUM - parseInt(values[fixedWidthField])
    ).toString();
  }

  return ret;
}

export const twoCardsChange: NoCodeComponentChangeFunction = ({
  newValue,
  prop,
  values,
  valuesAfterAuto,
}) => {
  // card1Width, card2Width and collapse are strictly correlated. When auto is turned on, all should go auto at the same time and vice versa.
  if (prop === "card1Width" || prop === "card2Width" || prop === "collapse") {
    // Auto turned on
    if (newValue === undefined) {
      return {
        collapse: undefined,
        card1Width: undefined,
        card2Width: undefined,
      };
    } else {
      const definedValues: WidthRelatedValues = {
        card1Width: valuesAfterAuto.card1Width,
        card2Width: valuesAfterAuto.card2Width,
        collapse: valuesAfterAuto.collapse,
      };

      if (prop === "collapse") {
        return correctCardWidths(
          { ...definedValues, collapse: newValue },
          "card1Width"
        );
      } else if (prop === "card1Width" || prop === "card2Width") {
        return {
          ...correctCardWidths({ ...definedValues, [prop]: newValue }, prop),
          collapse: values.collapse,
        };
      }
    }
  }
};

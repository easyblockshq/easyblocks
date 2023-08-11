import { ComponentConfigChangeFunction } from "@easyblocks/app-utils";
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

export const twoCardsChange: ComponentConfigChangeFunction = ({
  value,
  fieldName,
  values,
  closestDefinedValues,
}): Record<string, any> => {
  if (
    fieldName === "card1Width" ||
    fieldName === "card2Width" ||
    fieldName === "collapse"
  ) {
    const definedValues: WidthRelatedValues = {
      card1Width: closestDefinedValues.card1Width,
      card2Width: closestDefinedValues.card2Width,
      collapse: closestDefinedValues.collapse,
    };

    if (fieldName === "collapse") {
      if (values.card1Width === undefined) {
        // we don't touch undefined card widths
        return {
          collapse: value,
        };
      } else {
        return correctCardWidths(
          { ...definedValues, collapse: value },
          "card1Width"
        );
      }
    } else if (fieldName === "card1Width" || fieldName === "card2Width") {
      if (value === undefined) {
        return {
          collapse: values.collapse,
          card1Width: undefined,
          card2Width: undefined,
        };
      }

      return {
        ...correctCardWidths(
          { ...definedValues, [fieldName]: value },
          fieldName
        ),
        collapse: values.collapse,
      };
    } else {
      throw new Error("unreachable");
    }
  }

  return {
    [fieldName]: value,
  };
};

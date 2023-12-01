import { TrulyResponsiveValue } from "../types";
import { entries } from "@easyblocks/utils";

function responsiveValueValues<T>(value: TrulyResponsiveValue<T>): Array<T> {
  const values: Array<T> = [];

  entries(value).forEach(([key, v]) => {
    if (key === "$res") return;

    values.push(v as T);
  });

  return values;
}

export { responsiveValueValues };

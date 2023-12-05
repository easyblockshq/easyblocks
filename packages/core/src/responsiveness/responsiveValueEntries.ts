import { entries } from "@easyblocks/utils";
import { TrulyResponsiveValue } from "../types";

function responsiveValueEntries<T>(
  value: TrulyResponsiveValue<T>
): Array<[string, T]> {
  const values: Array<[string, T]> = [];

  entries(value).forEach(([key, v]) => {
    if (key === "$res") return;

    values.push([key, v as T]);
  });

  return values;
}

export { responsiveValueEntries };

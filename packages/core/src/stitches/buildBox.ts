import { Devices } from "../types";

export function buildBox(input: { [key: string]: any }, devices: Devices) {
  if (typeof input === "object" && input.$res) {
    const ret: { [key: string]: any } = {};

    for (const key in input) {
      if (key !== "$res") {
        ret["@" + key] = input[key];
      }
    }
    return ret;
  } else if (typeof input === "object" && input !== null) {
    const ret: { [key: string]: any } = {};

    /**
     * FIXME: there's a bug here!!!
     *
     * I don't know what to do about it. We add items in a correct order to the ret object, and JS should keep this order
     * but it clearly doesn't work and order gets broken. This breaks where "unset" is set in CSS and hence, inheritance is broken.
     *
     * This can be fixed by adding "specific media queries" (from - to) here. It's gonna work.
     */

    for (const key in input) {
      const val = input[key];

      if (typeof val === "object" && val.$res === true) {
        // const maxBreakpoint = responsiveValueGetMaxDefinedBreakpoint(val, devices);

        let isFirst = true;

        for (let i = devices.length - 1; i >= 0; i--) {
          const breakpoint = devices[i].id;

          if (val[breakpoint] === null || val[breakpoint] === undefined) {
            continue;
          }

          if (isFirst) {
            ret[key] = val[breakpoint];
            isFirst = false;
          } else {
            if (!ret["@" + breakpoint]) {
              ret["@" + breakpoint] = {};
            }

            ret["@" + breakpoint][key] = val[breakpoint];
          }
        }

        continue;
      }

      ret[key] = buildBox(val, devices);
    }

    return ret;
  }
  return input;
}

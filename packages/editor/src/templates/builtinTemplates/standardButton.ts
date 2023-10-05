import { ComponentConfig } from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";

export const standardButton = (
  color: string,
  backgroundColor: string | null
): ComponentConfig => ({
  _template: "$StandardButton",
  _id: uniqueId(),
  color: {
    $res: true,
    xl: {
      ref: color,
      value: "xxx",
    },
  },
  hasBackground: backgroundColor === null ? false : true,
  backgroundColor: {
    $res: true,
    xl: {
      ref: backgroundColor,
      value: "xxx",
    },
  },
  radius: {
    $res: true,
    xl: "10",
  },
  underline: backgroundColor === null ? "on-custom" : "off",
  underlineOffset: {
    $res: true,
    xl: "4",
  },
});

import { ComponentConfig } from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";

export const icon = (iconRef: string, color = "$dark"): ComponentConfig => ({
  _template: "$icon",
  _id: uniqueId(),
  icon: {
    ref: iconRef,
  },
  color: {
    $res: true,
    xl: {
      ref: color,
      value: "xxx",
    },
  },
});

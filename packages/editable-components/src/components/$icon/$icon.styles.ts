import { cleanupIconSVG } from "./cleanupIconSVG";
import { box } from "../../box";

export function iconStyles(values: any) {
  return {
    IconWrapper: box({
      display: "grid",
      color: values.passed_allowColor ? values.color : "currentColor",
    }),
    __props: {
      icon: cleanupIconSVG(values.icon),
    },
  };
}

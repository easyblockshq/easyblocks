import { cleanupIconSVG } from "../../cleanupIconSVG";
import { box } from "../../box";
import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";

export function iconStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput) {
  return {
    IconWrapper: box({
      display: "grid",
      color: params.passed_allowColor ? values.color : "currentColor",
    }),
    __props: {
      icon: cleanupIconSVG(values.icon),
    },
  };
}

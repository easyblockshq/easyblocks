import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { cleanupIconSVG } from "../../cleanupIconSVG";

export function iconStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  return {
    styled: {
      IconWrapper: {
        display: "grid",
        color: params.passed_allowColor ? values.color : "currentColor",
      },
    },
    props: {
      icon: cleanupIconSVG(values.icon),
    },
  };
}

import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { box } from "../../box";

export function buttonsStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput) {
  const align = params.passedAlign || "left";
  let flexAlign = "flex-start";
  if (align === "center") {
    flexAlign = "center";
  } else if (align === "right") {
    flexAlign = "flex-end";
  }

  return {
    ButtonsContainer: box({
      display: "flex",
      flexWrap: "wrap",
      flexDirection: values.verticalLayout ? "column" : "row",
      justifyContent: values.verticalLayout ? "normal" : flexAlign,
      alignItems: values.verticalLayout ? flexAlign : "center",
      gap: values.gap,
      pointerEvents: "auto", // force clickability
    }),
  };
}

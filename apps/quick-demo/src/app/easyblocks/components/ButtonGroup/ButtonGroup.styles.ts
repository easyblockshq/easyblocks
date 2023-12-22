import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";

export function buttonGroupStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  const align = params.passedAlign || "left";
  let flexAlign = "flex-start";
  if (align === "center") {
    flexAlign = "center";
  } else if (align === "right") {
    flexAlign = "flex-end";
  }

  return {
    styled: {
      ButtonsContainer: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: values.verticalLayout ? "column" : "row",
        justifyContent: values.verticalLayout ? "normal" : flexAlign,
        alignItems: values.verticalLayout ? flexAlign : "center",
        gap: values.gap,
        pointerEvents: "auto", // force clickability
      },
    },
  };
}

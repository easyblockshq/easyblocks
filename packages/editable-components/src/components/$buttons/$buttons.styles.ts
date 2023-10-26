import { box } from "../../box";

export function buttonsStyles(configProps: any) {
  const align = configProps.passedAlign || "left";
  let flexAlign = "flex-start";
  if (align === "center") {
    flexAlign = "center";
  } else if (align === "right") {
    flexAlign = "flex-end";
  }

  const gap = configProps.gap;

  return {
    ButtonsContainer: box({
      display: "flex",
      flexWrap: "wrap",
      flexDirection: configProps.verticalLayout ? "column" : "row",
      justifyContent: configProps.verticalLayout ? "normal" : flexAlign,
      alignItems: configProps.verticalLayout ? flexAlign : "center",
      // ">*:not(:last-child)": {
      //   marginRight: configProps.verticalLayout ? 0 : configProps.gap,
      //   marginBottom: configProps.verticalLayout ? configProps.gap : 0,
      // },
      gap,
      pointerEvents: "auto", // force clickability
    }),
  };
}

import { box } from "../../../box";

function styles(config: any) {
  const hasBackground: boolean = config.hasBackground;
  const hasBorder: boolean = config.hasBorder;
  const hasShadow: boolean = config.boxShadow !== "none";
  const isNaked = !hasBackground && !hasBorder && !hasShadow;

  const ButtonRoot = box(
    {
      // reset (no fonts, just SVG)
      margin: 0,
      padding: 0,
      overflow: "hidden",
      background: "transparent",
      WebkitAppearance: "none",

      // styles
      position: "relative",
      display: "grid",
      justifyContent: "center",
      alignItems: "center",

      width: isNaked ? "auto" : `${config.buttonSize}px`,
      height: isNaked ? "auto" : `${config.buttonSize}px`,

      backgroundColor: hasBackground ? config.backgroundColor : "transparent",
      borderWidth: hasBorder ? `${config.borderWidth}px` : 0,
      borderColor: config.borderColor,
      borderStyle: "solid",
      borderRadius: config.shape === "circle" ? "50%" : 0,
      boxShadow: config.boxShadow,

      transition: "opacity .15s",
      "&:hover": {
        opacity: 0.75,
      },

      cursor: "pointer",
    },
    "button"
  );

  return {
    symbol: {
      passed_allowColor: true,
    },
    ButtonRoot,
    IconWrapper: box({
      display: "grid",
      width: config.symbolSize + "px",
      height: config.symbolSize + "px",
    }),
  };
}

export default styles;

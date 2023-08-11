import { box } from "../../box";

function styles(config: any) {
  const hasBackground: boolean = config.hasBackground;
  const hasBorder: boolean = config.hasBorder;
  const hasShadow: boolean = config.boxShadow !== "none";
  const isNaked = !hasBackground && !hasBorder && !hasShadow;

  const ButtonRoot = box(
    {
      // reset (no fonts, just SVG)
      border: "none",
      margin: 0,
      padding: 0,
      overflow: "visible",
      background: "transparent",
      WebkitAppearance: "none",

      // styles
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: config.color,
      ...config.font,
      transition: "opacity .15s",
      textDecoration: config.underline === "off" ? "none" : "underline",
      textUnderlineOffset:
        config.underline === "on-custom"
          ? `${config.underlineOffset}px`
          : "auto",
      "&:hover": {
        opacity: 0.75,
      },
      minHeight: isNaked ? 0 : `${config.minHeight}px`,
      minWidth: isNaked ? 0 : `${config.minWidth}px`,
      paddingLeft: isNaked ? 0 : config.horizontalPadding,
      paddingRight: isNaked ? 0 : config.horizontalPadding,

      backgroundColor: hasBackground ? config.backgroundColor : "transparent",
      borderRadius: isNaked ? 0 : `${config.radius}px`,
      borderWidth: hasBorder ? `${config.borderWidth}px` : 0,
      borderColor: config.borderColor,
      borderStyle: "solid",

      whiteSpace: "nowrap",
      cursor: "pointer",
      boxShadow: config.boxShadow,
    },
    "button"
  );

  return {
    ButtonRoot,
  };
}

export default styles;

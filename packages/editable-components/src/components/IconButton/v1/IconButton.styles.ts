import { box } from "../../../box";

function styles(values: any) {
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
      width: values.buttonSize,
      height: values.buttonSize,

      backgroundColor: values.backgroundColor,
      borderRadius: values.shape === "circle" ? "50%" : 0,
      border: `${values.border}px solid ${values.borderColor}`,

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
      width: values.symbolSize + "px",
      height: values.symbolSize + "px",
    }),
  };
}

export default styles;

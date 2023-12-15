import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { cleanupIconSVG } from "@easyblocks/editable-components";

function buttonStyles({
  values,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  const hasBackground: boolean = values.hasBackground;
  const hasBorder: boolean = values.hasBorder;
  const hasShadow: boolean = values.boxShadow !== "none";
  const isNaked = !hasBackground && !hasBorder && !hasShadow;

  const sizeStyles =
    values.variant === "icon"
      ? {
          width: isNaked ? 0 : `${values.minHeight}px`,
          height: isNaked ? 0 : `${values.minHeight}px`,
        }
      : {
          minHeight: isNaked ? 0 : `${values.minHeight}px`,
          minWidth: isNaked ? 0 : `${values.minWidth}px`,
          paddingLeft: isNaked ? 0 : values.horizontalPadding,
          paddingRight: isNaked ? 0 : values.horizontalPadding,
        };

  const ButtonRoot = {
    __as: "button",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: values.gap,
    color: values.color,
    ...values.font,
    transition: "opacity .15s",
    textDecoration: values.underline === "off" ? "none" : "underline",
    textUnderlineOffset:
      values.underline === "on-custom" ? `${values.underlineOffset}px` : "auto",
    "&:hover": {
      opacity: 0.75,
    },
    ...sizeStyles,

    backgroundColor: hasBackground ? values.backgroundColor : "transparent",
    borderRadius:
      isNaked || values.cornerMode === "sharp"
        ? 0
        : `${values.cornerMode === "circled" ? 9999 : values.cornerRadius}px`,
    borderWidth: hasBorder ? `${values.borderWidth}px` : 0,
    borderColor: values.borderColor,
    borderStyle: "solid",

    whiteSpace: "nowrap",
    cursor: "pointer",
    boxShadow: values.boxShadow,
  };

  return {
    styled: {
      ButtonRoot,
      IconWrapper: {
        display: "grid",
        color: "currentColor",
        width: `${values.iconSize}px`,
        height: `${values.iconSize}px`,
        position: "relative",
      },
    },
    props: {
      icon: cleanupIconSVG(values.icon),
    },
  };
}

export { buttonStyles };

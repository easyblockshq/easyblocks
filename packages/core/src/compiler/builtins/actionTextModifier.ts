import {
  ComponentConfigBase,
  TokenValue,
  TrulyResponsiveValue,
} from "../../types";

const TRANSITION_TIMING_FUNCTION = "cubic-bezier(0.4, 0, 0.2, 1)";

const OPACITY_OPTIONS = Array.from({ length: 10 }, (_, index) => {
  const percentageValue = (index + 1) * 10;

  return {
    value: `${percentageValue / 100}`,
    label: `${percentageValue}%`,
  };
});

const actionTextModifier = {
  id: "$StandardActionStyles",
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_basic_styling.png",
  label: "Basic styles",
  schema: [
    {
      prop: "isColorOverwriteEnabled",
      type: "boolean",
      label: "Enable",
      group: "Color",
    },
    {
      prop: "color",
      type: "color",
      label: "Color",
      group: "Color",
      visible: ({ isColorOverwriteEnabled }: any) => isColorOverwriteEnabled,
    },
    {
      prop: "isHoverColorEnabled",
      type: "boolean",
      label: "Enable",
      group: "Hover color",
      visible: ({ underline }: any) => {
        return underline !== "none";
      },
    },
    {
      prop: "hoverColor",
      type: "color",
      label: "Color",
      group: "Hover color",
      visible: ({ underline, isHoverColorEnabled }: any) => {
        return underline !== "none" && isHoverColorEnabled;
      },
    },
    {
      prop: "underline",
      type: "select",
      params: {
        options: [
          {
            value: "none",
            label: "Off",
          },
          {
            value: "enabled",
            label: "On",
          },
          {
            value: "showOnHover",
            label: "Show on hover",
          },
          {
            value: "hideOnHover",
            label: "Hide on hover",
          },
        ],
      },
      label: "Underline",
      group: "Underline",
      defaultValue: "enabled",
    },
    {
      prop: "opacity",
      type: "select",
      params: { options: OPACITY_OPTIONS },
      label: "Opacity",
      group: "Opacity",
      defaultValue: "1",
    },
    {
      prop: "hoverOpacity",
      type: "select",
      params: { options: OPACITY_OPTIONS },
      label: "Hover opacity",
      group: "Opacity",
      visible: ({ underline }: any) => {
        return underline !== "none";
      },
      defaultValue: "0.7",
    },
    {
      prop: "hoverOpacityAnimationDuration",
      type: "select",
      params: {
        options: [
          {
            value: "0ms",
            label: "0ms",
          },
          {
            value: "50ms",
            label: "50ms",
          },
          {
            value: "100ms",
            label: "100ms",
          },
          {
            value: "150ms",
            label: "150ms",
          },
          {
            value: "200ms",
            label: "200ms",
          },
        ],
      },
      label: "Duration",
      group: "Animation",
      defaultValue: "100ms",
    },
  ],
  apply: ({
    isColorOverwriteEnabled,
    color,
    underline,
    isHoverColorEnabled,
    hoverColor,
    opacity,
    hoverOpacity,
    hoverOpacityAnimationDuration,
  }: any) => {
    let styles: Record<string, any> = {
      textDecoration: "none",
      color: "inherit",
      opacity,
      transition: `opacity ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION}`,
    };

    if (underline === "enabled") {
      styles = {
        ...styles,
        textDecoration: "underline",
        textDecorationColor: isColorOverwriteEnabled ? color : "currentColor",
        transition: `text-decoration-color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION},
           color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION}`,
      };

      const interactiveColor = isHoverColorEnabled
        ? hoverColor
        : isColorOverwriteEnabled
        ? color
        : "currentColor";

      const interactiveStyles: Record<string, any> = {
        opacity: hoverOpacity,
      };

      if (isColorOverwriteEnabled) {
        styles.color = color;
      }

      styles["&:hover"] = interactiveColor;
      styles["&:focus"] = interactiveStyles;
    } else if (underline === "showOnHover") {
      styles = {
        ...styles,
        textDecoration: "underline",
        textDecorationColor: "transparent",
        transition: `text-decoration-color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION},
           color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION}`,
      };

      if (isColorOverwriteEnabled) {
        styles.color = color;
      }

      let interactiveStyles: Record<string, any> = {
        opacity: hoverOpacity,
      };

      if (isColorOverwriteEnabled || isHoverColorEnabled) {
        interactiveStyles = {
          ...interactiveStyles,
          color: isHoverColorEnabled ? hoverColor : color,
          textDecorationColor: isHoverColorEnabled ? hoverColor : color,
        };
      } else {
        interactiveStyles = {
          ...interactiveStyles,
          textDecorationColor: "currentColor",
        };
      }

      styles["&:hover"] = interactiveStyles;
      styles["&:focus"] = interactiveStyles;
    } else if (underline === "hideOnHover") {
      styles = {
        ...styles,
        textDecoration: "underline",
        textDecorationColor: "currentColor",
        transition: `text-decoration-color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION},
           color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION}`,
      };

      if (isColorOverwriteEnabled) {
        styles.color = color;
        styles.textDecorationColor = color;
      }

      const interactiveStyles: Record<string, any> = {
        opacity: hoverOpacity,
        textDecorationColor: "transparent",
      };

      if (isHoverColorEnabled) {
        interactiveStyles.color = hoverColor;
      }

      styles["&:hover"] = interactiveStyles;
      styles["&:focus"] = interactiveStyles;
    }

    return styles;
  },
  type: "actionTextModifier",
};

type StandardActionStylesConfig =
  ComponentConfigBase<"$StandardActionStyles"> & {
    isColorOverwriteEnabled: boolean;
    color: TrulyResponsiveValue<TokenValue>;
    underline: "enabled" | "none" | "showOnHover" | "hideOnHover";
    isHoverColorEnabled: boolean;
    hoverColor: TrulyResponsiveValue<TokenValue>;
    opacity: string;
    hoverOpacity: string;
    hoverOpacityAnimationDuration: `${0 | 50 | 100 | 150 | 200}ms`;
  };

export { actionTextModifier };
export type { StandardActionStylesConfig };

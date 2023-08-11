import type { InternalTextModifierDefinition } from "@easyblocks/app-utils";
import { ColorSchemaProp, ComponentConfigBase } from "@easyblocks/core";

const TRANSITION_TIMING_FUNCTION = "cubic-bezier(0.4, 0, 0.2, 1)";

const OPACITY_OPTIONS = Array.from({ length: 10 }, (_, index) => {
  const percentageValue = (index + 1) * 10;

  return {
    value: `${percentageValue / 100}`,
    label: `${percentageValue}%`,
  };
});

const actionTextModifier: InternalTextModifierDefinition = {
  id: "$StandardActionStyles",
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
      visible: ({ isColorOverwriteEnabled }) => isColorOverwriteEnabled,
    },
    {
      prop: "isHoverColorEnabled",
      type: "boolean",
      label: "Enable",
      group: "Hover color",
      visible: ({ underline }) => {
        return underline !== "none";
      },
    },
    {
      prop: "hoverColor",
      type: "color",
      label: "Color",
      group: "Hover color",
      visible: ({ underline, isHoverColorEnabled }) => {
        return underline !== "none" && isHoverColorEnabled;
      },
    },
    {
      prop: "underline",
      type: "select",
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
      label: "Underline",
      group: "Underline",
    },
    {
      prop: "opacity",
      type: "select",
      options: OPACITY_OPTIONS,
      label: "Opacity",
      group: "Opacity",
    },
    {
      prop: "hoverOpacity",
      type: "select",
      options: OPACITY_OPTIONS,
      label: "Hover opacity",
      group: "Opacity",
      visible: ({ underline }) => {
        return underline !== "none";
      },
    },
    {
      prop: "hoverOpacityAnimationDuration",
      type: "select",
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
      label: "Duration",
      group: "Animation",
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
  }) => {
    const styles: Record<string, any> = {
      textDecoration: "none",
      color: "inherit",
      opacity,
      transition: `opacity ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION}`,
    };

    if (underline === "enabled") {
      const childStyles: Record<string, any> = {
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
        "& span": {
          textDecorationColor: interactiveColor,
        },
      };

      if (isColorOverwriteEnabled) {
        childStyles.color = color;
        interactiveStyles["& span"].color = interactiveColor;
      }

      styles["& span"] = childStyles;
      styles["&:hover"] = interactiveStyles;
      styles["&:focus"] = interactiveStyles;
    } else if (underline === "showOnHover") {
      const childStyles: Record<string, any> = {
        textDecoration: "underline",
        textDecorationColor: "transparent",
        transition: `text-decoration-color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION},
           color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION}`,
      };

      if (isColorOverwriteEnabled) {
        childStyles.color = color;
      }

      const interactiveStyles: Record<string, any> = {
        opacity: hoverOpacity,
      };

      if (isColorOverwriteEnabled || isHoverColorEnabled) {
        interactiveStyles["& span"] = {
          color: isHoverColorEnabled ? hoverColor : color,
          textDecorationColor: isHoverColorEnabled ? hoverColor : color,
        };
      } else {
        interactiveStyles["& span"] = { textDecorationColor: "currentColor" };
      }

      styles["& span"] = childStyles;
      styles["&:hover"] = interactiveStyles;
      styles["&:focus"] = interactiveStyles;
    } else if (underline === "hideOnHover") {
      const childStyles: Record<string, any> = {
        textDecoration: "underline",
        textDecorationColor: "currentColor",
        transition: `text-decoration-color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION},
           color ${hoverOpacityAnimationDuration} ${TRANSITION_TIMING_FUNCTION}`,
      };

      if (isColorOverwriteEnabled) {
        childStyles.color = color;
        childStyles.textDecorationColor = color;
      }

      const interactiveStyles: Record<string, any> = {
        opacity: hoverOpacity,
        "& span": {
          textDecorationColor: "transparent",
        },
      };

      if (isHoverColorEnabled) {
        interactiveStyles["& span"].color = hoverColor;
      }

      styles["& span"] = childStyles;
      styles["&:hover"] = interactiveStyles;
      styles["&:focus"] = interactiveStyles;
    }

    return styles;
  },
  tags: ["actionTextModifier"],
};

type StandardActionStylesConfig =
  ComponentConfigBase<"$StandardActionStyles"> & {
    isColorOverwriteEnabled: boolean;
    color: NonNullable<ColorSchemaProp["defaultValue"]>;
    underline: "enabled" | "none" | "showOnHover" | "hideOnHover";
    isHoverColorEnabled: boolean;
    hoverColor: NonNullable<ColorSchemaProp["defaultValue"]>;
    opacity: string;
    hoverOpacity: string;
    hoverOpacityAnimationDuration: `${0 | 50 | 100 | 150 | 200}ms`;
  };

function getDefaultActionTextModifier({
  breakpointIndex,
}: {
  breakpointIndex: string;
}): Omit<StandardActionStylesConfig, "_id"> {
  return {
    _template: "$StandardActionStyles",
    isColorOverwriteEnabled: true,
    color: {
      $res: true,
      [breakpointIndex]: {
        value: "#0166cc",
      },
    },
    hoverColor: {
      $res: true,
      [breakpointIndex]: {
        ref: "black",
        value: "black",
      },
    },
    isHoverColorEnabled: false,
    underline: "enabled",
    opacity: "1",
    hoverOpacity: "1",
    hoverOpacityAnimationDuration: "100ms",
  };
}

export { actionTextModifier, getDefaultActionTextModifier };
export type { StandardActionStylesConfig };

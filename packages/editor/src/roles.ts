import { Roles } from "./types";

export const roles: Roles = {
  section: {
    id: "section",
  },
  card: {
    id: "card",
    masters: [
      {
        id: "productCard",
        label: "Product Card",
      },
    ],
  },
  background: {
    id: "background",
  },
  button: {
    id: "button",
    masters: [
      {
        id: "buttonLight",
        label: "Button Light",
      },
      {
        id: "buttonDark",
        label: "Button Dark",
      },
      {
        id: "buttonTextLight",
        label: "Button Text Light",
      },
      {
        id: "buttonTextDark",
        label: "Button Text Dark",
      },
      {
        id: "buttonSliderLeft",
        label: "Slider left button",
      },
      {
        id: "buttonSliderRight",
        label: "Slider right button",
      },
      {
        id: "buttonSliderLeftDark",
        label: "Slider left button dark",
      },
      {
        id: "buttonSliderRightDark",
        label: "Slider right button dark",
      },
    ],
  },
  symbol: {
    id: "symbol",
  },
  actionTextModifier: {
    id: "actionTextModifier",
    masters: [
      {
        id: "actionTextModifierDefault",
        label: "Use as default",
        alwaysVisible: true,
      },
    ],
  },
  action: {
    id: "action",
  },
  actionLink: {
    id: "actionLink",
  },
  item: {
    id: "item",
  },
};

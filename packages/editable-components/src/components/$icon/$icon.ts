import { NoCodeComponentDefinition } from "@easyblocks/core";
import { iconStyles } from "./$icon.styles";

const iconComponentDefinition: NoCodeComponentDefinition = {
  id: "$icon",
  styles: iconStyles,
  type: "symbol",
  schema: [
    {
      prop: "icon",
      type: "icon",
      label: "Icon",
    },

    /**
     * Icon is tricky.
     *
     * 1. First, icon is of type "symbol", we might have different kinds of symbols in the future, animated, etc.
     * 2. When we have component like IconButton (built-in) it's very natural to set color for icon symbol. At the end of the day we don't want to have color for both IconButton AND Icon. It doesn't make sense.
     * 3. However, sometimes custom button might want to FORCE a color for an icon.
     * 4. Auto color means that color is set by a parent component (always custom). By default it's set to "false" for built-in Icon Button.
     * 5. Probably later we should do this via some context.
     */
    {
      prop: "color",
      label: "Color",
      type: "color",
      group: "Color",
      visible: (values) => !!values.passed_allowColor,
      defaultValue: {
        ref: "$dark",
        value: "black",
      },
    },
  ],
};

export { iconComponentDefinition };

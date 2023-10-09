import standardButtonStyles from "./StandardButton.styles";
import {
  buttonActionSchemaProp,
  buttonLabelSchemaProp,
  buttonOptionalIconSchemaProp,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";

export const StandardButtonNoCodeComponent: InternalRenderableComponentDefinition<"$StandardButton"> =
  {
    id: "$StandardButton",
    label: "Basic Button",
    thumbnail:
      "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button.png",
    type: "button",
    styles: standardButtonStyles,
    schema: [
      // buttonActionSchemaProp,

      {
        prop: "Action",
        label: "Action",
        type: "component", // for now actions are components
        noInline: true,
        componentTypes: ["action"],
        visible: true,
        group: "Action",
        defaultValue: [],
        isLabelHidden: true,
      },

      {
        prop: "variant",
        type: "select",
        group: "Label and Icon",
        label: "Variant",
        options: [
          { value: "label", label: "Label" },
          { value: "icon", label: "Icon" },
          { value: "label-icon", label: "Label + Icon" },
        ],
      },

      {
        prop: "label",
        type: "text",
        label: "Label",
        group: "Label and Icon",
        normalize: (x) => {
          if (x.trim() === "") {
            return null;
          }
          return x;
        },
        visible: (values) => {
          return values.variant !== "icon";
        },
      },

      {
        prop: "icon",
        type: "icon",
        label: "Icon",
        group: "Label and Icon",
        visible: (values) => {
          return values.variant !== "label";
        },
      },

      {
        prop: "color",
        type: "color",
        group: "General styles",
        label: "Color",
        defaultValue: {
          ref: "$dark",
          value: "?",
        },
      },
      {
        prop: "minHeight",
        type: "string$",
        defaultValue: "42",
        group: "General styles",
        label: "Min height",
        visible: (values) => {
          return values.hasBorder || values.hasBackground;
        },
        normalize: pxValueNormalize(0, 256),
      },
      {
        prop: "minWidth",
        type: "string$",
        defaultValue: "100",
        group: "General styles",
        label: "Min width",
        visible: (values) => {
          return (
            values.variant !== "icon" &&
            (values.hasBorder || values.hasBackground)
          );
        },
        normalize: pxValueNormalize(0, 512),
      },
      {
        prop: "horizontalPadding",
        type: "space",
        group: "General styles",
        label: "Left / Right padding",
        visible: (values) => {
          return (
            values.variant !== "icon" &&
            (values.hasBorder || values.hasBackground)
          );
        },
        defaultValue: {
          ref: "16",
          value: "16px",
        },
      },
      {
        prop: "gap",
        type: "space",
        group: "General styles",
        label: "Gap",
        visible: (values) => {
          return values.variant === "label-icon";
        },
        defaultValue: {
          ref: "6",
          value: "6px",
        },
      },
      {
        prop: "cornerMode",
        type: "select$",
        label: "Corners",
        group: "General styles",
        options: ["sharp", "circled", "custom"],
      },
      {
        prop: "cornerRadius",
        type: "string$",
        visible: (values) => {
          return (
            values.cornerMode === "custom" &&
            (values.hasBorder ||
              values.hasBackground ||
              values.boxShadow !== "none")
          );
        },
        group: "General styles",
        label: "Corner radius",
        normalize: pxValueNormalize(1, 50),
        defaultValue: "8",
      },

      {
        prop: "font",
        type: "font",
        group: "Label styles",
        label: "Style",
        defaultValue: {
          ref: "$body2.bold",
          value: {},
        },
        visible: (values) => {
          return values.variant !== "icon";
        },
      },
      {
        prop: "underline",
        type: "select",
        group: "Label styles",
        label: "Underline",
        options: [
          {
            value: "off",
            label: "Off",
          },
          {
            value: "on",
            label: "On",
          },
          {
            value: "on-custom",
            label: "On (custom offset)",
          },
        ],
        visible: (values) => {
          return values.variant !== "icon";
        },
      },
      {
        prop: "underlineOffset",
        type: "string$",
        group: "Label styles",
        label: "Underline offset",
        visible: (values) => {
          return values.variant !== "icon" && values.underline === "on-custom";
        },
        normalize: pxValueNormalize(1, 16),
        defaultValue: "1",
      },

      {
        prop: "iconSize",
        label: "Size",
        type: "string$",
        defaultValue: "24",
        group: "Icon styles",
        normalize: pxValueNormalize(8, 128),
        visible: (values) => {
          return values.variant !== "label";
        },
      },

      {
        prop: "hasBackground",
        type: "boolean",
        group: "Background",
        label: "Enabled",
        defaultValue: true,
      },
      {
        prop: "backgroundColor",
        type: "color",
        defaultValue: {
          ref: "$neutral",
          value: "grey",
        },
        visible: (values) => {
          return !!values.hasBackground;
        },
        group: "Background",
        label: "Color",
      },

      {
        prop: "hasBorder",
        type: "boolean",
        group: "Border and shadow",
        label: "Border enabled",
      },
      {
        prop: "borderWidth",
        type: "string$",
        defaultValue: "1",
        group: "Border and shadow",
        label: "Border width",
        visible: (values) => {
          return !!values.hasBorder;
        },
        normalize: pxValueNormalize(1, 16),
      },
      {
        prop: "borderColor",
        type: "color",
        defaultValue: {
          ref: "$dark",
          value: "black",
        },
        group: "Border and shadow",
        label: "Border color",
        visible: (values) => {
          return !!values.hasBorder;
        },
      },
      {
        prop: "boxShadow", // main image size
        label: "Box shadow",
        type: "stringToken",
        tokenId: "boxShadows",
        defaultValue: {
          ref: "none",
          value: "none",
        },
        group: "Border and shadow",
      },
    ],
    editing: ({ editingInfo, values }) => {
      const fields = editingInfo.fields;
      const minHeightField = fields.find(
        (field) => field.path === "minHeight"
      )!;

      if (values.variant === "icon") {
        minHeightField.label = "Size";
      }

      return editingInfo;
    },
  };

function pxValueNormalize(from: number, to: number) {
  return (x: string) => {
    const num = parseInt(x);
    if (isNaN(num)) {
      return null;
    }

    if (num < from || num > to) {
      return null;
    }

    return num.toString();
  };
}

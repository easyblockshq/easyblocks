import { NoCodeComponentDefinition } from "@easyblocks/core";
import { assertDefined } from "@easyblocks/utils";
import { buttonStyles } from "./Button.styles";
import { pxValueNormalize } from "../utils/pxValueNormalize";

export const buttonComponentDefinition: NoCodeComponentDefinition = {
  id: "Button",
  label: "Button",
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_button.png",
  type: "button",
  styles: buttonStyles,
  schema: [
    {
      prop: "Action",
      label: "Action",
      type: "component",
      noInline: true,
      accepts: ["action"],
      visible: (values) => {
        return values.noAction !== true;
      },
      group: "Action",
      isLabelHidden: true,
    },

    {
      prop: "variant",
      type: "select",
      group: "Label and Icon",
      label: "Variant",
      params: {
        options: [
          { value: "label", label: "Label" },
          { value: "icon", label: "Icon" },
          { value: "label-icon", label: "Label + Icon" },
        ],
      },
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
      buildOnly: true,
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
      type: "string",
      responsive: true,
      defaultValue: "42",
      group: "General styles",
      label: "Min height",
      visible: (values) => {
        return values.hasBorder || values.hasBackground;
      },
      params: { normalize: pxValueNormalize(0, 256) },
    },
    {
      prop: "minWidth",
      type: "string",
      responsive: true,
      defaultValue: "100",
      group: "General styles",
      label: "Min width",
      visible: (values) => {
        return (
          values.variant !== "icon" &&
          (values.hasBorder || values.hasBackground)
        );
      },
      params: { normalize: pxValueNormalize(0, 512) },
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
      type: "select",
      responsive: true,
      label: "Corners",
      group: "General styles",
      params: { options: ["sharp", "circled", "custom"] },
    },
    {
      prop: "cornerRadius",
      type: "string",
      responsive: true,
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
      params: { normalize: pxValueNormalize(1, 50) },
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
      params: {
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
      },
      visible: (values) => {
        return values.variant !== "icon";
      },
    },
    {
      prop: "underlineOffset",
      type: "string",
      responsive: true,
      group: "Label styles",
      label: "Underline offset",
      visible: (values) => {
        return values.variant !== "icon" && values.underline === "on-custom";
      },
      params: { normalize: pxValueNormalize(1, 16) },
      defaultValue: "1",
    },

    {
      prop: "iconSize",
      label: "Size",
      type: "string",
      responsive: true,
      defaultValue: "24",
      group: "Icon styles",
      params: { normalize: pxValueNormalize(8, 128) },
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
      type: "string",
      responsive: true,
      defaultValue: "1",
      group: "Border and shadow",
      label: "Border width",
      visible: (values) => {
        return !!values.hasBorder;
      },
      params: { normalize: pxValueNormalize(1, 16) },
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
      params: { tokenId: "boxShadows" },
      defaultValue: {
        ref: "none",
        value: "none",
      },
      group: "Border and shadow",
    },
  ],
  editing: ({ editingInfo, values }) => {
    const fields = editingInfo.fields;
    const minHeightField = assertDefined(
      fields.find((field) => field.path === "minHeight"),
      "minHeight field not found in StandardButton component fields"
    );

    if (values.variant === "icon") {
      minHeightField.label = "Size";
    }

    return editingInfo;
  },
};

import {
  ChildComponentEditingInfo,
  NoCodeComponentDefinition,
} from "@easyblocks/core";
import { gridStyles } from "./Grid.styles";
import { gridAuto } from "./Grid.auto";
import { GridCompiledValues, GridParams } from "./Grid.types";
import {
  sectionWrapperEditing,
  sectionWrapperSchemaProps,
} from "../utils/sectionWrapper/sectionWrapperHelpers";

export const gridComponentDefinition: NoCodeComponentDefinition<
  GridCompiledValues,
  GridParams
> = {
  id: "Grid",
  label: "Collection",
  type: "section",
  schema: [
    ...sectionWrapperSchemaProps.margins,
    {
      prop: "escapeMargin",
      label: "Escape",
      type: "boolean",
      responsive: true,
      group: "Section margins",
    },
    {
      prop: "Cards",
      type: "component-collection",
      accepts: ["card"],
      picker: "large-3",
      itemFields: [
        {
          prop: "itemSize",
          label: "Item size",
          group: "General",
          type: "select",
          responsive: true,
          params: {
            options: ["1x1", "2x1", "2x2"],
          },
        },
        {
          prop: "verticalAlign",
          label: "Vertical align",
          group: "General",
          type: "select",
          responsive: true,
          params: {
            options: ["auto", "top", "center", "bottom", "stretch"],
          },
        },
      ],
    },
    {
      prop: "variant",
      label: "Variant",
      type: "radio-group",
      responsive: true,
      group: "Grid / Slider",
      params: {
        options: [
          {
            value: "grid",
            label: "Grid",
          },
          {
            value: "slider",
            label: "Slider",
          },
        ],
      },
    },
    {
      prop: "numberOfItems",
      label: "Visible items",
      type: "select",
      responsive: true,
      group: "Grid / Slider",
      params: {
        options: ["1", "2", "3", "4", "5", "6"],
      },
      defaultValue: "4",
    },
    {
      prop: "fractionalItemWidth",
      label: "Fraction",
      type: "select",
      responsive: true,
      params: {
        options: [
          { value: "1", label: "none" },
          { value: "1.25", label: "25%" },
          { value: "1.5", label: "50%" },
          { value: "1.75", label: "75%" },
        ],
      },
      defaultValue: "1.25",
      group: "Grid / Slider",
      visible: (values, { editorContext }) => {
        if (values.variant === "grid") {
          return false;
        }
        return editorContext.breakpointIndex === "xs";
      },
    },
    {
      prop: "columnGap",
      label: "Gap",
      type: "space",
      group: "Grid / Slider",
      defaultValue: {
        tokenId: "16",
      },
      params: {
        autoConstant: 16,
      },
    },
    {
      prop: "rowGap",
      label: "Gap vertical",
      type: "space",
      visible: (values) => values.variant === "grid",
      group: "Grid / Slider",
      defaultValue: {
        tokenId: "16",
      },
      params: {
        autoConstant: 16,
      },
    },
    {
      prop: "verticalAlign",
      label: "Vertical align",
      type: "select",
      responsive: true,
      params: {
        options: ["top", "center", "bottom", "stretch"],
      },
      group: "Grid / Slider",
    },
    {
      prop: "showSliderControls",
      label: "Show slider controls?",
      type: "boolean",
      responsive: true,
      visible: false,
      group: "Grid / Slider",
    },
    {
      prop: "shouldSliderItemsBeVisibleOnMargin",
      label: "Show items on margins?",
      type: "boolean",
      responsive: true,
      visible: (values) => values.variant === "slider",
      group: "Grid / Slider",
      defaultValue: true,
    },

    {
      prop: "gridMainObjectAspectRatio",
      label: "Main object aspect ratio",
      type: "aspectRatio",
      group: "Grid / Slider",
      defaultValue: {
        tokenId: "$gridMainObjectDefault",
      },
      visible: false,
    },
    {
      prop: "paddingTop",
      label: "Top",
      type: "space",
      defaultValue: {
        tokenId: "0",
      },
      visible: (x) => !!x.borderEnabled && x.borderTop !== "0",
      group: "Padding",
    },
    {
      prop: "paddingBottom",
      label: "Bottom",
      type: "space",
      defaultValue: {
        tokenId: "0",
      },
      visible: (x) => !!x.borderEnabled && x.borderBottom !== "0",
      group: "Padding",
    },
    {
      prop: "paddingLeft",
      label: "Left",
      type: "space",
      defaultValue: {
        tokenId: "0",
      },
      visible: (x) =>
        !!x.borderEnabled &&
        (x.borderLeft !== "0" || x.borderTop !== "0" || x.borderBottom !== "0"),
      group: "Padding",
    },
    {
      prop: "paddingRight",
      label: "Right",
      type: "space",
      defaultValue: {
        tokenId: "0",
      },
      visible: (x) =>
        !!x.borderEnabled &&
        (x.borderRight !== "0" ||
          x.borderTop !== "0" ||
          x.borderBottom !== "0"),
      group: "Padding",
    },

    // Left arrow properties
    {
      prop: "LeftArrow",
      type: "component",
      accepts: ["button"],
      required: true,
    },
    {
      prop: "leftArrowPlacement",
      label: "Left arrow placement",
      type: "select",
      responsive: true,
      params: {
        options: ["inside", "center", "outside", "screen-edge"],
      },
      group: "Placement",
    },
    {
      prop: "leftArrowOffset",
      label: "Left arrow offset",
      type: "space",
      group: "Placement",
    },

    // Right arrow properties
    {
      prop: "RightArrow",
      type: "component",
      accepts: ["button"],
      required: true,
    },
    {
      prop: "rightArrowPlacement",
      label: "Right arrow placement",
      type: "select",
      responsive: true,
      params: {
        options: ["inside", "center", "outside", "screen-edge"],
      },
      group: "Placement",
    },
    {
      prop: "rightArrowOffset",
      label: "Right arrow offset",
      type: "space",
      group: "Placement",
    },
    ...sectionWrapperSchemaProps.headerAndBackground,
  ],
  styles: gridStyles,
  editing: ({ values, params, editingInfo, device }) => {
    const sectionEditing = sectionWrapperEditing({
      editingInfo,
      values,
      params,
      device,
    });

    const fields = Object.fromEntries(
      editingInfo.fields.map((f) => [f.path, f])
    );

    const leftArrowFields = [fields.leftArrowPlacement];

    if (values.leftArrowPlacement !== "center") {
      leftArrowFields.push(fields.leftArrowOffset);
    }

    const rightArrowFields = [fields.rightArrowPlacement];

    if (values.rightArrowPlacement !== "center") {
      rightArrowFields.push(fields.rightArrowOffset);
    }

    const cards = editingInfo.components
      .Cards as Array<ChildComponentEditingInfo>;

    return {
      fields: [...(sectionEditing.fields ?? []), ...editingInfo.fields].filter(
        (field) =>
          !field.path.startsWith("rightArrow") &&
          !field.path.startsWith("leftArrow")
      ),
      components: {
        ...sectionEditing.components,
        Cards: cards.map((cardItem) => ({
          ...cardItem,
          direction: "horizontal",
        })),
        LeftArrow: {
          fields: leftArrowFields,
        },
        RightArrow: {
          fields: rightArrowFields,
        },
      },
    };
  },
  auto: gridAuto,
};

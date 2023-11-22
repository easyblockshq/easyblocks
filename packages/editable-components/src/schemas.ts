import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import {
  ChildComponentEditingInfo,
  EditingComponentFields,
  EditingField,
  NoCodeComponentEditingFunctionResult,
  SchemaProp,
} from "@easyblocks/core";
import { range } from "@easyblocks/utils";

import { bannerCard2Auto } from "./components/BannerCard2/BannerCard2.auto";
import bannerCard2Styles from "./components/BannerCard2/BannerCard2.styles";

import { twoCardsChange } from "./components/TwoCards/TwoCards.change";
import twoCardsStyles from "./components/TwoCards/TwoCards.styles";

import { gridAuto } from "./components/Grid/Grid.auto";
import grid2Styles from "./components/Grid/Grid.styles";

import placeholderStyles from "./components/Placeholder/Placeholder.styles";
import { StandardButtonNoCodeComponent } from "./components/StandardButton/StandardButton";

import $separatorStyles from "./components/Separator/Separator.styles";

import { sectionWrapperEditing } from "./components/SectionWrapper/SectionWrapper.editing";
import { $sectionWrapperStyles } from "./components/SectionWrapper/SectionWrapper.styles";

import { borderSchemaProps } from "./borderHelpers";
import { backgroundColorComponentDefinition } from "./components/$backgroundColor/$backgroundColor";
import { buttonsComponentDefinition } from "./components/$buttons/$buttons";
import { imageComponentDefinition } from "./components/$image/image";
import { rootGridComponentDefinition } from "./components/$RootGrid/$RootGrid";
import { rootSectionsComponentDefinition } from "./components/$RootSections/$RootSections";
import { stackComponentDefinition } from "./components/$stack/stack";
import { twoItemsComponentDefinition } from "./components/$twoItems/twoItems";
import { videoComponentDefinition } from "./components/$video/video";
import { bannerCard2SeparateStackModeController } from "./components/BannerCard2/BannerCard2.controller";
import {
  basicBackgroundCardDefinition,
  basicCardDefinition,
} from "./components/BasicCard/BasicCard";
import { arePaddingFieldsSeparate } from "./components/BasicCard/BasicCard.controller";
import { cardPlaceholderDefinition } from "./components/CardPlaceholder/CardPlaceholder";
import { componentContainerDefinition } from "./components/ComponentContainer/ComponentContainer";
import { playgroundComponentDefinition } from "./components/Playground/Playground";
import { twoCardsAuto } from "./components/TwoCards/TwoCards.auto";
import { TWO_CARDS_COL_NUM } from "./components/TwoCards/twoCardsConstants";
import { vimeoPlayerEditableComponent } from "./components/vimeoPlayer/vimeoPlayer";
import { zoneComponentDefinition } from "./components/Zone/Zone";

export const sectionWrapperFieldsProvider = (options: {
  fixedEscapeMarginValue?: boolean;
}): SchemaProp[] => {
  const extraEscapeMarginProps: { defaultValue?: boolean; visible: boolean } = {
    visible: true,
  };

  if (options.fixedEscapeMarginValue === true) {
    extraEscapeMarginProps.visible = false;
    extraEscapeMarginProps.defaultValue = true;
  } else if (options.fixedEscapeMarginValue === false) {
    extraEscapeMarginProps.visible = false;
  }

  return [
    {
      prop: "containerMargin",
      label: "Left / Right",
      type: "space",
      group: "Section margins",
      params: {
        prefix: "containerMargin",
      },
    },
    {
      prop: "containerMaxWidth", // main image size
      label: "Max width",
      type: "stringToken",
      params: {
        tokenId: "containerWidths",
      },
      defaultValue: {
        ref: "none",
        value: "none",
      },
      group: "Section margins",
    },

    {
      prop: "escapeMargin",
      label: "Escape",
      type: "boolean",
      responsive: true,
      group: "Section margins",
      ...extraEscapeMarginProps,
    },
    {
      prop: "hide",
      label: "Hide",
      type: "boolean",
      responsive: true,
      group: "General",
    },

    // HEADER
    {
      prop: "headerMode",
      label: "Variant",
      type: "select",
      params: {
        options: [
          { value: "none", label: "No header" },
          { value: "1-stack", label: "1 stack" },
          { value: "2-stacks", label: "2 stacks" },
        ],
      },
      group: "Section Header",
    },
    {
      prop: "layout1Stack",
      label: "Position",
      type: "select",
      group: "Section Header",
      params: {
        options: [
          {
            value: "left",
            label: "Left",
            // icon: SSIcons.AlignLeft,
            // hideLabel: true,
          },
          {
            value: "center",
            label: "Center",
            // icon: SSIcons.AlignCenter,
            // hideLabel: true,
          },
          {
            value: "right",
            label: "Right",
            // icon: SSIcons.AlignRight,
            // hideLabel: true,
          },
        ],
      },
      visible: (values) => {
        return values.headerMode === "1-stack";
      },
    },

    {
      prop: "layout2Stacks",
      label: "Position",
      type: "select",
      responsive: true,
      group: "Section Header",
      params: {
        options: [
          {
            value: "left-right",
            label: "left + right",
          },
          {
            value: "center-right",
            label: "center + right",
          },
          {
            value: "stacked-left",
            label: "stacked left",
          },
          {
            value: "stacked-center",
            label: "stacked center",
          },
          {
            value: "stacked-right",
            label: "stacked right",
          },
          {
            value: "below-left",
            label: "above+below left",
          },
          {
            value: "below-center",
            label: "above+below center",
          },
          {
            value: "below-right",
            label: "above+below right",
          },
        ],
      },
      visible: (values) => {
        return values.headerMode === "2-stacks";
      },
    },
    {
      prop: "layout2StacksVerticalAlign",
      label: "Align",
      type: "select",
      responsive: true,
      group: "Section Header",
      params: {
        options: ["center", "top", "bottom"],
      },
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          !values.layout2Stacks.startsWith("stacked") &&
          !values.layout2Stacks.startsWith("below")
        );
      },
    },

    {
      prop: "headerStacksGap",
      label: "Stacks gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          values.layout2Stacks &&
          values.layout2Stacks.startsWith("stacked")
        );
      },
      defaultValue: {
        value: "12px",
        ref: "12",
      },
    },

    {
      prop: "headerSectionGap",
      label: "Gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return values.headerMode !== "none";
      },
      defaultValue: {
        value: "12px",
        ref: "12",
      },
    },
    {
      prop: "footerSectionGap",
      label: "Bottom gap",
      type: "space",
      group: "Section Header",
      visible: (values) => {
        return (
          values.headerMode === "2-stacks" &&
          values.layout2Stacks &&
          values.layout2Stacks.startsWith("below")
        );
      },
      defaultValue: {
        value: "12px",
        ref: "12",
      },
    },
    /**
     * The problem is that we can't show label based on values :(
     */
    {
      prop: "HeaderStack",
      label: "Stack",
      type: "component",
      accepts: ["$stack"],
      required: true,
    },
    {
      prop: "HeaderSecondaryStack",
      label: "Stack",
      type: "component",
      accepts: ["$stack"],
      required: true,
    },

    // section background
    {
      prop: "Background__",
      label: "Outer Background",
      type: "component",
      group: "Section background",
      accepts: ["$backgroundColor", "$image", "$video"],
      visible: true,
    },
    {
      prop: "padding",
      label: "Inner margin",
      type: "space",
      group: "Section background",
      visible: (values) => {
        return values.Background__ && values.Background__.length > 0;
      },
      defaultValue: {
        value: "24px",
        ref: "24",
      },
    },
  ];
};

const sectionWrapperFields = sectionWrapperFieldsProvider({});
const sectionWrapperFieldsWithoutEscapeMargin = sectionWrapperFieldsProvider({
  fixedEscapeMarginValue: true,
});

export const builtinEditableComponentsDefinitions: InternalRenderableComponentDefinition[] =
  [
    // root sections
    zoneComponentDefinition,
    rootSectionsComponentDefinition,
    rootGridComponentDefinition,

    imageComponentDefinition,
    videoComponentDefinition,
    buttonsComponentDefinition,

    {
      id: "$separator",
      type: "item",
      label: "Separator",
      thumbnail:
        "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_separator.png",
      styles: $separatorStyles,
      schema: [
        {
          prop: "color",
          type: "color",
          label: "Color",
          defaultValue: {
            ref: "black",
            value: "black",
          },
        },
        {
          prop: "height",
          label: "Stroke width",
          type: "select",
          responsive: true,
          params: {
            options: [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
            ],
          },
        },
      ],
    },
    twoItemsComponentDefinition,

    backgroundColorComponentDefinition,

    stackComponentDefinition,

    {
      id: "$BannerSection2",
      type: "section",
      label: "Hero Banner",
      styles: $sectionWrapperStyles,
      editing: sectionWrapperEditing,
      pasteSlots: ["Component"],
      schema: [
        ...sectionWrapperFields,
        {
          prop: "Component",
          type: "component",
          accepts: ["$BannerCard2"],
          required: true,
        },
      ],
      allowSave: true,
    },
    {
      id: "$Grid",
      type: "section",
      label: "Collection",
      icon: "grid_3x3",
      styles: $sectionWrapperStyles,
      editing: sectionWrapperEditing,
      schema: [
        ...sectionWrapperFields.filter((x) => x.group === "General"),
        {
          prop: "Component",
          type: "component",
          accepts: ["$GridCard"],
          required: true,
        },
        ...sectionWrapperFields.filter((x) => x.group !== "General"),
      ],
      pasteSlots: ["Component"],
      allowSave: true,
    },
    {
      id: "$TwoCards",
      type: "section",
      label: "Two Cards",
      styles: $sectionWrapperStyles,
      editing: sectionWrapperEditing,
      schema: [
        ...sectionWrapperFieldsWithoutEscapeMargin,
        {
          prop: "Component",
          type: "component",
          accepts: ["$TwoCardsCard"],
          required: true,
        },
      ],
    },

    {
      id: "$GridCard",
      pasteSlots: ["Cards"],
      type: "card",
      styles: grid2Styles,
      auto: gridAuto,
      hideTemplates: true,
      editing: ({ values, editingInfo }) => {
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
          fields: editingInfo.fields.filter(
            (field) =>
              !field.path.startsWith("rightArrow") &&
              !field.path.startsWith("leftArrow")
          ),
          components: {
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
      schema: [
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
          // visible: (values, { editorContext }) => {
          //   if (values.variant === "grid") {
          //     return true;
          //   }
          //   return editorContext.breakpointIndex !== "xs";
          // },
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

              // { value: "2", label: "50%" },
              // { value: "1.66", label: "60%" },
              // { value: "1.43", label: "70%" },
              // { value: "1.25", label: "80%" },
              // { value: "1.11", label: "90%" },
              // { value: "1", label: "100%" },
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
            ref: "16",
            value: "16px",
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
            ref: "16",
            value: "16px",
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
          type: "stringToken",
          params: {
            tokenId: "aspectRatios",
          },
          group: "Grid / Slider",
          defaultValue: {
            ref: "$gridMainObjectDefault",
            value: "whatever", // will be normalized anyway
          },
          visible: false,
        },
        {
          prop: "borderEnabled",
          label: "Enable",
          type: "boolean",
          group: "Border",
        },
        {
          prop: "borderColor",
          label: "Color",
          type: "color",
          defaultValue: {
            ref: "$dark",
            value: "black",
          },
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderTop",
          label: "Top width",
          type: "select",
          responsive: true,
          params: {
            options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          },
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderBottom",
          label: "Bottom width",
          type: "select",
          responsive: true,
          params: {
            options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          },
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderLeft",
          label: "Left width",
          type: "select",
          responsive: true,
          params: {
            options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          },
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderRight",
          label: "Right width",
          type: "select",
          responsive: true,
          params: {
            options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          },
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },
        {
          prop: "borderInner",
          label: "Inner width",
          type: "select",
          responsive: true,
          params: {
            options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
          },
          defaultValue: "1",
          visible: (x) => !!x.borderEnabled,
          group: "Border",
        },

        {
          prop: "paddingTop",
          label: "Top",
          type: "space",
          defaultValue: {
            ref: "0",
            value: "0px",
          },
          visible: (x) => !!x.borderEnabled && x.borderTop !== "0",
          group: "Padding",
        },
        {
          prop: "paddingBottom",
          label: "Bottom",
          type: "space",
          defaultValue: {
            ref: "0",
            value: "0px",
          },
          visible: (x) => !!x.borderEnabled && x.borderBottom !== "0",
          group: "Padding",
        },
        {
          prop: "paddingLeft",
          label: "Left",
          type: "space",
          defaultValue: {
            ref: "0",
            value: "0px",
          },
          visible: (x) =>
            !!x.borderEnabled &&
            (x.borderLeft !== "0" ||
              x.borderTop !== "0" ||
              x.borderBottom !== "0"),
          group: "Padding",
        },
        {
          prop: "paddingRight",
          label: "Right",
          type: "space",
          defaultValue: {
            ref: "0",
            value: "0px",
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
      ],
    },
    // {
    //   id: "$BannerCard",
    //   type: "card",
    //   pasteSlots: ["SideImage", "Stack"],
    //   styles: bannerCardStyles,
    //   auto: bannerCardAuto,
    //   schema: bannerFields,
    //   editing: () => {
    //     return {
    //       components: {
    //         SideImage: {
    //           selectable: false,
    //         },
    //         Background: {
    //           selectable: false,
    //         },
    //         Stack: {
    //           selectable: false,
    //         },
    //       },
    //     };
    //   },
    // },
    {
      id: "$TwoCardsCard",
      type: "card",
      auto: twoCardsAuto,
      styles: twoCardsStyles,
      change: twoCardsChange,
      hideTemplates: true,
      allowSave: true,
      editing: ({ values, editingInfo }) => {
        const fields = Object.fromEntries(
          editingInfo.fields.map((f) => [f.path, f])
        );

        fields.card1Width.visible = false;
        fields.card1EscapeMargin.visible = false;
        fields.card2Width.visible = false;
        fields.card2EscapeMargin.visible = false;
        fields.verticalOffset.visible = values.verticalLayout === "irregular";
        fields.gap.visible =
          parseInt(values.card1Width) + parseInt(values.card2Width) ===
            TWO_CARDS_COL_NUM && !values.collapse;
        fields.verticalGap.visible = values.collapse;
        fields.invertCollapsed.visible = values.collapse;

        return {
          fields: editingInfo.fields,
          components: {
            Card1: {
              fields: [
                {
                  ...fields.card1Width,
                  visible: true,
                  group: "Placement and size",
                  label: "Width",
                },
                {
                  ...fields.card1EscapeMargin,
                  visible: true,
                  group: "Placement and size",
                  label: "Escape margin",
                },
                {
                  ...fields.gap,
                  group: "Placement and size",
                  label: "Gap",
                },
                {
                  ...fields.verticalLayout,
                  group: "Placement and size",
                },
                {
                  ...fields.verticalOffset,
                  group: "Placement and size",
                },
              ],
            },
            Card2: {
              fields: [
                {
                  ...fields.card2Width,
                  visible: true,
                  group: "Placement and size",
                  label: "Width",
                },
                {
                  ...fields.card2EscapeMargin,
                  visible: true,
                  group: "Placement and size",
                  label: "Escape margin",
                },
                {
                  ...fields.gap,
                  group: "Placement and size",
                  label: "Gap",
                },
                {
                  ...fields.verticalLayout,
                  group: "Placement and size",
                },
                {
                  ...fields.verticalOffset,
                  group: "Placement and size",
                },
              ],
            },
          },
        };
      },

      schema: [
        {
          prop: "Card1",
          type: "component",
          picker: "large-3",
          accepts: ["card"],
        },
        {
          prop: "Card2",
          type: "component",
          picker: "large-3",
          accepts: ["card"],
        },
        {
          prop: "card1Width",
          type: "select",
          responsive: true,
          params: {
            options: [
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
            ],
          },
          defaultValue: "12",
        },
        {
          prop: "card1EscapeMargin",
          type: "boolean",
          responsive: true,
          label: "Escape margin",
        },
        {
          prop: "card2Width",
          type: "select",
          responsive: true,
          params: {
            options: range(4, 20).map(String),
          },
          defaultValue: "12",
          label: "Width",
        },
        {
          prop: "card2EscapeMargin",
          type: "boolean",
          responsive: true,
          label: "Escape margin",
        },
        {
          prop: "verticalLayout",
          type: "select",
          responsive: true,
          params: {
            options: [
              { label: "Top", value: "align-top" },
              { label: "Bottom", value: "align-bottom" },
              { label: "Center", value: "center" },
              { label: "Fit", value: "fit" },
              { label: "Irregular", value: "irregular" },
            ],
          },
          label: "Align",
          group: "Layout",
        },
        {
          prop: "verticalOffset",
          label: "Offset",
          type: "select",
          responsive: true,
          params: {
            options: Array.from(Array(25).keys()).map((x) => `${x - 12}`),
          },
          defaultValue: "-4",
          group: "Layout",
        },
        {
          prop: "collapse",
          label: "Stack cards",
          type: "boolean",
          responsive: true,
          group: "Layout",
        },
        {
          prop: "gap",
          label: "Gap",
          type: "space",
          defaultValue: {
            value: "32px",
            ref: "32",
          },
          group: "Layout",
        },
        {
          prop: "verticalGap",
          label: "Gap",
          type: "space",
          defaultValue: {
            value: "24px",
            ref: "24",
          },
          group: "Layout",
        },
        {
          prop: "invertCollapsed",
          label: "Invert",
          type: "boolean",
          group: "Layout",
        },
      ],
    },

    {
      id: "$Placeholder",
      type: "card",
      styles: placeholderStyles,
      hideTemplates: true,
      schema: [],
    },

    StandardButtonNoCodeComponent,

    playgroundComponentDefinition,

    {
      id: "$BannerCard2",
      label: "Basic Card",
      type: "card",
      pasteSlots: ["Card1", "Card2"],
      styles: bannerCard2Styles,
      auto: bannerCard2Auto,
      editing: ({ values, editingInfo }) => {
        const isNoneMode = values.mode === "none";
        const isBackgroundWithSeparateStackMode =
          values.mode === "background-separate-stack";

        let newFields: Required<NoCodeComponentEditingFunctionResult>["fields"] =
          [...editingInfo.fields];

        const modeIndexPlus1 =
          editingInfo.fields.findIndex(
            (field) => field.path === "sideModeWidth"
          ) + 1;
        const fieldsBefore = editingInfo.fields.slice(0, modeIndexPlus1);
        const fieldsAfter = editingInfo.fields.slice(modeIndexPlus1);
        const fields = Object.fromEntries(
          editingInfo.fields.map((f) => [f.path, f])
        );

        fields.sideModeWidth.visible = false;

        const card1Fields: (typeof editingInfo)["fields"] = [];

        const card1Size: EditingField = {
          type: "field",
          path: `Card1.0.size`,
        };

        const card1Background: EditingField = {
          type: "field",
          path: `Card1.0.Background`,
        };

        const card1StackFields: Array<EditingComponentFields> = [
          {
            type: "fields",
            path: `Card1.0`,
            filters: {
              group: "Stack",
            },
          },
        ];

        const fieldFromCard2 = (
          fieldName: string,
          group: string,
          label?: string
        ) => {
          const field: EditingField = {
            type: "field",
            path: `Card2.0.${fieldName}`,
            label,
            group,
          };

          return field;
        };

        const card2FieldPortalsBasic = [
          fieldFromCard2("size", "Cover"),
          fieldFromCard2("Background", "Cover", "Cover"),
        ];

        const card2FieldPortalsAll = [
          ...card2FieldPortalsBasic,
          ...borderSchemaProps("whatever").map((schemaProp) =>
            fieldFromCard2(schemaProp.prop, "Cover")
          ),
        ];

        // hide all background mode fields by default
        for (const field of editingInfo.fields) {
          if (field.path.startsWith("backgroundMode")) {
            fields[field.path].visible = false;
          }
        }

        // if (isNoneMode) {
        //   newFields = [...fieldsBefore, ...card1StackFields, ...fieldsAfter];
        // } else if (isBackgroundMode) {
        //   newFields = [
        //     ...fieldsBefore,
        //     ...card2FieldPortalsAll,
        //     ...card1StackFields,
        //     ...fieldsAfter,
        //   ];
        // } else if (isBackgroundWithSeparateStackMode) {
        //   newFields = [
        //     ...fieldsBefore,
        //     ...card2FieldPortalsAll,
        //     ...fieldsAfter,
        //   ];
        // } else if (values.mode === "left" || values.mode === "right") {
        //   fields.sideModeWidth.visible = true;
        //   newFields = [
        //     ...fieldsBefore,
        //     ...card2FieldPortalsBasic,
        //     ...fieldsAfter,
        //   ];
        // } else if (values.mode === "top" || values.mode === "bottom") {
        //   newFields = [
        //     ...fieldsBefore,
        //     ...card2FieldPortalsBasic,
        //     ...fieldsAfter,
        //   ];
        // }

        if (isBackgroundWithSeparateStackMode) {
          const { fieldsHorizontal, fieldsVertical } =
            bannerCard2SeparateStackModeController(values);

          // for (const key in fields) {
          //
          //   if (key.startsWith("backgroundMode")) {
          //     card1Fields.push({...fields[key]});
          //   }

          const backgroundModePosition: EditingField = {
            ...fields["backgroundModePosition"],
            group: "Placement",
          };
          const backgroundModeEdgeMarginProtection: EditingField = {
            ...fields["backgroundModeEdgeMarginProtection"],
            group: "Placement",
          };
          const backgroundModePaddingLeft: EditingField = {
            ...fields["backgroundModePaddingLeft"],
            group: "Placement",
          };
          const backgroundModePaddingRight: EditingField = {
            ...fields["backgroundModePaddingRight"],
            group: "Placement",
          };
          const backgroundModePaddingTop: EditingField = {
            ...fields["backgroundModePaddingTop"],
            group: "Placement",
          };
          const backgroundModePaddingBottom: EditingField = {
            ...fields["backgroundModePaddingBottom"],
            group: "Placement",
          };

          backgroundModePosition.visible = true;
          backgroundModeEdgeMarginProtection.visible = true;

          if (arePaddingFieldsSeparate(fieldsHorizontal)) {
            if (fieldsHorizontal.start !== null) {
              backgroundModePaddingLeft.visible = true;
            }
            if (fieldsHorizontal.end !== null) {
              backgroundModePaddingRight.visible = true;
            }
          } else {
            if (fieldsHorizontal.both !== null) {
              backgroundModePaddingLeft.visible = true;
              backgroundModePaddingLeft.label = "Offset horizontal";
            }
          }

          if (arePaddingFieldsSeparate(fieldsVertical)) {
            if (fieldsVertical.start !== null) {
              backgroundModePaddingTop.visible = true;
            }
            if (fieldsVertical.end !== null) {
              backgroundModePaddingBottom.visible = true;
            }
          } else {
            if (fieldsVertical.both !== null) {
              backgroundModePaddingTop.visible = true;
              backgroundModePaddingTop.label = "Offset vertical";
            }
          }

          card1Fields.push(
            backgroundModePosition,
            backgroundModePaddingLeft,
            backgroundModePaddingRight,
            backgroundModePaddingTop,
            backgroundModePaddingBottom,
            backgroundModeEdgeMarginProtection
          );
          // }

          newFields = [
            ...fieldsBefore,
            // card1Background,
            // ...card1StackFields,
            ...card2FieldPortalsAll,
            ...fieldsAfter,
          ];
        } else if (isNoneMode) {
          newFields = [
            ...fieldsBefore,
            card1Size,
            card1Background,
            ...card1StackFields,
            ...fieldsAfter,
          ];
        } else {
          newFields = [
            ...fieldsBefore,
            card1Background,
            ...card1StackFields,
            ...fieldsAfter,
          ];
        }

        return {
          fields: newFields,

          components: {
            Card1: {
              selectable: isBackgroundWithSeparateStackMode, //!(isBackgroundMode || isNoneMode),
              fields: card1Fields,
              // passedSize: isNoneMode ? "__undefined__" : "none", // "__undefined__" is a shit workaround for things going messy when "undefined" is set and responsiveness
            },
            Card2: {
              selectable: !isBackgroundWithSeparateStackMode,
              // passedSize: "gowno"

              // passedSize: "__undefined__",
            },
            // Background: {
            //   selectable: false
            // }
          },
        };
      },
      schema: [
        {
          prop: "cornerRadius",
          label: "Corner radius",
          type: "select",
          responsive: true,
          params: {
            options: Array.from(Array(30).keys()).map((x) => x.toString()),
          },
          group: "General",
        },
        ...borderSchemaProps("General"),

        // {
        //   prop: "Background",
        //   label: "Background",
        //   type: "component",
        //   accepts: ["$backgroundColor", "$image", "$video"],
        //   visible: true,
        //   group: "General",
        // },

        {
          prop: "Card1",
          label: "Card1",
          type: "component",
          accepts: ["$BasicCard"],
          required: true,
        },
        {
          prop: "Card2",
          label: "Card2",
          type: "component",
          accepts: ["$BasicCardBackground"],
          required: true,
        },
        {
          prop: "mode", // main image size
          label: "Position",
          type: "select",
          responsive: true,
          params: {
            options: [
              { value: "none", label: "none" },
              // { value: "background", label: "background" },
              { value: "left", label: "left" },
              { value: "right", label: "right" },
              { value: "top", label: "top" },
              { value: "bottom", label: "bottom" },
              {
                value: "background-separate-stack",
                label: "background",
              },
            ], // there is no "fit-content", because it doesn't make sense on mobile and it's actually very rare. If you want image, you don't want it to have some super narrow height, so the height is kind of "minimal" heihgt only.
          },
          group: "Cover",
        },
        {
          prop: "sideModeWidth", // main image size
          label: "Width",
          type: "select",
          responsive: true,
          params: {
            options: ["25%", "33%", "40%", "50%", "60%", "66%", "75%"], // there is no "fit-content", because it doesn't make sense on mobile and it's actually very rare. If you want image, you don't want it to have some super narrow height, so the height is kind of "minimal" heihgt only.
          },
          group: "Cover",
          defaultValue: "50%",
        },
        {
          prop: "backgroundModePosition",
          label: "Position",
          type: "position",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: "bottom-center",
        },

        {
          prop: "backgroundModePaddingLeft",
          label: "Offset left",
          type: "space",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: {
            value: "24px",
            ref: "24",
          },
        },
        {
          prop: "backgroundModePaddingRight",
          label: "Offset right",
          type: "space",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: {
            value: "24px",
            ref: "24",
          },
        },

        {
          prop: "backgroundModePaddingTop",
          label: "Offset top",
          type: "space",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: {
            value: "24px",
            ref: "24",
          },
        },

        {
          prop: "backgroundModePaddingBottom",
          label: "Offset bottom",
          type: "space",
          group: "Content Card",
          visible: (values) => {
            return values.mode === "background";
          },
          defaultValue: {
            value: "24px",
            ref: "24",
          },
        },

        {
          prop: "backgroundModeEdgeMarginProtection",
          label: "Snap to container margin",
          type: "boolean",
          responsive: true,
          defaultValue: true,
          group: "Content Card",
        },

        // buttonActionSchemaProp,
      ],
    },

    vimeoPlayerEditableComponent as any,
    basicCardDefinition,
    basicBackgroundCardDefinition,
    cardPlaceholderDefinition,
    componentContainerDefinition,

    {
      id: "$MissingComponent",
      label: "Missing",
      schema: [
        {
          prop: "error",
          type: "string",
          visible: false,
        },
      ],
    },
    // {
    //   id: "$MissingAction",
    //   label: "Missing",
    //   schema: [],
    //   type: "action",
    // },
  ];

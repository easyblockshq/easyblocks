import { NoCodeComponentDefinition } from "@easyblocks/core";
import { twoCardsStyles } from "./TwoCards.styles";
import { TwoCardsCompiledValues } from "./TwoCards.types";
import {
  SectionWrapperValues,
  sectionWrapperEditing,
  sectionWrapperSchemaProps,
} from "../utils/sectionWrapper";
import { twoCardsChange } from "./TwoCards.change";
import { TWO_CARDS_COL_NUM } from "./twoCardsConstants";
import { range } from "@easyblocks/utils";
import { twoCardsAuto } from "@/app/easyblocks/components/TwoCards/TwoCards.auto";

const twoCardsComponentDefinition: NoCodeComponentDefinition<
  TwoCardsCompiledValues & SectionWrapperValues
> = {
  id: "TwoCards",
  type: "section",
  label: "Two Cards",
  schema: [
    ...sectionWrapperSchemaProps.margins,
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
    ...sectionWrapperSchemaProps.headerAndBackground,
  ],
  styles: twoCardsStyles,
  // change: twoCardsChange,
  editing: (args) => {
    const sectionEditing = sectionWrapperEditing(args);
    const { editingInfo, values } = args;

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
        ...sectionEditing.components,
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
  auto: twoCardsAuto,
  // @ts-expect-error Add proper signature for `change`
  change: twoCardsChange,
};

export { twoCardsComponentDefinition };

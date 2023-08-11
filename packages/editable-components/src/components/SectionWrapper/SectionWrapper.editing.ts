import type { EditingFunction } from "@easyblocks/core";

export const sectionWrapperEditing: EditingFunction = ({ editingInfo }) => {
  const fields = Object.fromEntries(editingInfo.fields.map((f) => [f.path, f]));
  return {
    fields: [
      ...editingInfo.fields.filter((field) => field.group === "General"),
      {
        type: "fields",
        path: "Component.0",
      },
      ...editingInfo.fields.filter((field) => field.group !== "General"),
    ],
    components: {
      Component: {
        selectable: false,
      },
      Background__: {
        selectable: false,
      },
      HeaderStack: {
        fields: [
          fields.headerMode,
          fields.layout1Stack,
          fields.layout2Stacks,
          fields.headerSectionGap,
          fields.layout2StacksVerticalAlign,
          fields.footerSectionGap,
          fields.headerStacksGap,
        ],
      },
      HeaderSecondaryStack: {
        fields: [
          fields.headerMode,
          fields.layout2Stacks,
          fields.headerSectionGap,
          fields.layout2StacksVerticalAlign,
          fields.footerSectionGap,
          fields.headerStacksGap,
        ],
      },
    },
  };
};

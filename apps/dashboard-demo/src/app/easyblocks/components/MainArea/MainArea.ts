import { NoCodeComponentDefinition } from "@easyblocks/core";

const mainAreaDefinition: NoCodeComponentDefinition<{
  Panels: Array<{ size: string }>;
  columnsCount: string;
}> = {
  id: "MainArea",
  schema: [
    {
      prop: "HeaderStack",
      type: "component",
      required: true,
      accepts: ["Stack"],
    },
    {
      prop: "Panels",
      type: "component-collection",
      accepts: ["PanelCard", "PanelCardImagePreview"],
      itemFields: [
        {
          prop: "size",
          label: "Size",
          type: "select",
          params: {
            options: ["1x1", "2x1"],
          },
          defaultValue: "1x1",
        },
      ],
      placeholderAppearance: {
        aspectRatio: 1,
        label: "Add panel",
      },
    },
    {
      prop: "columnsCount",
      type: "select",
      responsive: true,
      label: "Columns count",
      params: {
        options: ["1", "2"],
      },
      defaultValue: "2",
    },
  ],
  styles({ values }) {
    return {
      styled: {
        PanelsGrid: {
          display: "grid",
          gridTemplateColumns: values.columnsCount === "1" ? "1fr" : "1fr 1fr",
          gap: 12,
        },
        HeaderStack: {
          passedAlign: "left",
        },
        panelWrappers:
          values.Panels.length > 0
            ? values.Panels.map((p) => {
                return {
                  gridColumn: p.size === "2x1" ? "1 / span 2" : "auto",
                };
              })
            : [{ gridColumn: "auto" }],
      },
    };
  },
  editing({ values }) {
    return {
      components: {
        HeaderStack: {
          selectable: false,
        },
        Panels: values.Panels.map((p) => {
          return {
            direction: "horizontal",
          };
        }),
      },
    };
  },
};

function createMainAreaBasedDefinition(params: {
  id: string;
  label: string;
  rootParams?: NoCodeComponentDefinition["rootParams"];
}) {
  return {
    ...mainAreaDefinition,
    id: params.id,
    label: params.label,
    rootParams: params.rootParams,
  };
}

export { mainAreaDefinition, createMainAreaBasedDefinition };

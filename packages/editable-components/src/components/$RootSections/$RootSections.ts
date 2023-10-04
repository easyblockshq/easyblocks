import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { ChildComponentEditingInfo, EditingField } from "@easyblocks/core";
import { rootSectionStyles } from "./$RootSections.styles";

const rootSectionsComponentDefinition: InternalRenderableComponentDefinition<"$RootSections"> =
  {
    id: "$RootSections",
    styles: rootSectionStyles,
    editing: ({ editingInfo }) => {
      const data = editingInfo.components
        .data as Array<ChildComponentEditingInfo>;

      return {
        components: {
          data: data.map((item, index) => {
            let fields = item.fields;

            if (index > 0) {
              fields = [
                {
                  ...(data[index - 1].fields[1] as EditingField),
                  label: "Top margin",
                },
                fields[1],
              ];
            }

            return {
              fields,
            };
          }),
        },
      };
    },
    schema: [
      {
        prop: "data",
        label: "data",
        type: "component-collection",
        picker: "large",
        componentTypes: ["section"],
        itemFields: [
          {
            prop: "topMargin", // property only for first value!
            label: "Top",
            type: "space",
            group: "Section margins",
            defaultValue: {
              value: "0px",
              ref: "0",
            },
            autoConstant: 24,
          },

          {
            prop: "bottomMargin",
            label: "Bottom",
            type: "space",
            group: "Section margins",
            defaultValue: {
              value: "32px",
              ref: "32",
            },
            autoConstant: 24,
          },
        ],
      },
    ],
  };

export { rootSectionsComponentDefinition };

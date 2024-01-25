import { NoCodeComponentDefinition } from "@easyblocks/core";

const propertiesGroupDefinition: NoCodeComponentDefinition<{
  Properties: Array<{}>;
  variant: string;
}> = {
  id: "PropertiesGroup",
  schema: [
    {
      prop: "Properties",
      type: "component-collection",
      accepts: ["PropertyTextItem", "PropertyBooleanItem", "PropertyDateItem"],
    },
    {
      prop: "variant",
      label: "Variant",
      type: "radio-group",
      params: {
        options: [
          { value: "stacked", label: "Stacked" },
          { value: "compact", label: "Compact" },
        ],
      },
    },
  ],
  styles({ values }) {
    return {
      components: {
        Properties: {
          itemProps: values.Properties.map(() => {
            return {
              variant: values.variant,
            };
          }),
        },
      },
    };
  },
};

export { propertiesGroupDefinition };

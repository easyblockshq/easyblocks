import { NoCodeComponentDefinition } from "@easyblocks/core";

const appShellHeaderDefinition: NoCodeComponentDefinition = {
  id: "AppShellHeader",
  schema: [
    {
      prop: "Items",
      type: "component-collection",
      accepts: ["HeaderLink"],
      placeholderAppearance: {
        width: 100,
        height: 28,
        label: "Add link",
      },
    },
  ],
  styles: ({ values }) => {
    return {
      styled: {
        Root: {
          display: "flex",
          flexDirection: "row",
          gap: "12px",
        },
      },
    };
  },
  editing: ({ values }) => {
    return {
      components: {
        Items: values.Items.map(() => ({
          direction: "horizontal",
        })),
      },
    };
  },
};

export { appShellHeaderDefinition };

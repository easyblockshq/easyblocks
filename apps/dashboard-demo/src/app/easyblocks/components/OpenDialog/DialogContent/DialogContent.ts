import { NoCodeComponentDefinition, box } from "@easyblocks/core";

const dialogContentDefinition: NoCodeComponentDefinition = {
  id: "DialogContent",
  schema: [
    {
      prop: "padding",
      label: "Padding",
      type: "space",
      defaultValue: {
        ref: "12",
        value: "12px",
      },
    },
    {
      prop: "size",
      label: "Size",
      type: "select",
      params: {
        options: ["600px", "900px", "1200px"],
      },
    },
    {
      prop: "Content",
      type: "component",
      required: true,
      accepts: ["Stack"],
    },
  ],
  styles: ({ values }) => {
    return {
      styled: {
        Root: {
          width: "calc(100vw - 48px)",
          maxWidth: values.size,
          background: "white",
          padding: values.padding,
        },
      },
    };
  },
  editing() {
    return {
      components: {
        Content: {
          selectable: false,
        },
      },
    };
  },
};

export { dialogContentDefinition };

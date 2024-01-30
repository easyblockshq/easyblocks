import { NoCodeComponentDefinition, box } from "@easyblocks/core";

const separatorDefinition: NoCodeComponentDefinition = {
  id: "Separator",
  type: "item",
  styles({ values }) {
    return {
      styled: {
        Container: {
          minHeight: 9,
          display: "flex",
          alignItems: "center",
          position: "relative",
        },
        Separator: {
          height: values.height + "px",
          width: "100%",
          backgroundColor: values.color,
        },
      },
    };
  },
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
};

export { separatorDefinition };

import {
  ChildComponentEditingInfo,
  NoCodeComponentDefinition,
  box,
} from "@easyblocks/core";

const horizontalLayoutDefinition: NoCodeComponentDefinition = {
  id: "HorizontalLayout",
  type: "item",
  label: "Horizontal layout",
  pasteSlots: ["Items"],
  styles({ values, params }) {
    const $width = params.$width;

    const items =
      values.Items.length > 0
        ? values.Items
        : [{ columnWidth: "fill", itemWidth: "fill", itemAlign: "flex-start" }];

    const $itemWidth = $width / items.length;

    const outerWrappers: Array<Record<string, unknown>> = [];
    const innerWrappers: Array<Record<string, unknown>> = [];

    items.forEach((x: any) => {
      outerWrappers.push({
        display: "flex",
        flex: x.columnWidth === "fill" ? "1 1 0" : `0 0 ${x.columnWidth}px`,
        justifyContent: x.itemWidth === "fill" ? "stretch" : x.itemAlign,
      });

      innerWrappers.push({
        display: "grid",
        flexBasis: x.itemWidth === "fill" ? "100%" : `${x.itemWidth}px`,
      });
    });

    return {
      styled: {
        Container: box({
          display: "flex",
          flexDirection: "row",
          alignItems: values.verticalAlign,
          gap: values.gap,
        }),
        outerWrappers,
        innerWrappers,
      },
      components: {
        Items: {
          itemProps: items.map((x: any) => ({
            align:
              x.itemAlign === "flex-start"
                ? "left"
                : x.itemAlign === "center"
                ? "center"
                : "right",
            $width: $itemWidth,
            $widthAuto: false,
          })),
        },
      },
    };
  },
  editing({ values, editingInfo }) {
    return {
      components: {
        Items: values.Items.map((_: any, index: number) => {
          return {
            direction: "horizontal",
            fields: (
              editingInfo.components.Items as Array<ChildComponentEditingInfo>
            )[index].fields,
          };
        }),
      },
    };
  },
  schema: [
    {
      prop: "gap",
      type: "space",
      label: "Gap",
    },
    {
      prop: "verticalAlign",
      type: "radio-group",
      responsive: true,
      params: {
        options: [
          { value: "flex-start", label: "Top" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "Bottom" },
        ],
      },
      label: "Vertical align",
    },
    {
      prop: "Items",
      label: "Items",
      type: "component-collection",
      accepts: ["item"],
      itemFields: [
        {
          prop: "columnWidth",
          label: "Column width",
          type: "select",
          responsive: true,
          params: {
            options: [
              "fill",
              "32",
              "64",
              "96",
              "128",
              "160",
              "192",
              "224",
              "256",
              "288",
              "320",
              "352",
              "384",
              "416",
              "448",
              "480",
              "512",
            ],
          },
        },
        {
          prop: "itemWidth",
          label: "Item max width",
          type: "select",
          responsive: true,
          params: {
            options: [
              "fill",
              "32",
              "64",
              "96",
              "128",
              "160",
              "192",
              "224",
              "256",
              "288",
              "320",
              "352",
              "384",
              "416",
              "448",
              "480",
              "512",
            ],
          },
        },
        {
          prop: "itemAlign",
          label: "Item align",
          type: "radio-group",
          responsive: true,
          params: {
            options: [
              {
                value: "flex-start",
                label: "Left",
                icon: "AlignLeft",
                hideLabel: true,
              },
              {
                value: "center",
                label: "Center",
                icon: "AlignCenter",
                hideLabel: true,
              },
              {
                value: "flex-end",
                label: "Right",
                icon: "AlignRight",
                hideLabel: true,
              },
            ],
          },
          defaultValue: "left",
        },
      ],
    },
  ],
};

export { horizontalLayoutDefinition };

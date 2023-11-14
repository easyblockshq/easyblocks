import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { ChildComponentEditingInfo } from "@easyblocks/core";
import $twoItems from "./$twoItems.styles";

const twoItemsComponentDefinition: InternalRenderableComponentDefinition<"$twoItems"> =
  {
    id: "$twoItems",
    type: "item",
    label: "Horizontal layout",
    thumbnail:
      "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_horizontal_layout.png",
    pasteSlots: ["Items"],
    styles: $twoItems,
    editing: ({ values, editingInfo }) => {
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
        type: "radio-group$",
        options: [
          { value: "flex-start", label: "Top" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "Bottom" },
        ],
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
            type: "select$",
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
          {
            prop: "itemWidth",
            label: "Item max width",
            type: "select$",
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
          {
            prop: "itemAlign",
            label: "Item align",
            type: "radio-group$",
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
            defaultValue: "left",
          },
        ],
      },
    ],
  };

export { twoItemsComponentDefinition };

import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { ChildComponentEditingInfo } from "@easyblocks/core";
import $stackStyles from "./$stack.styles";

const maxWidthScale = ["max"];

for (let i = 2; i < 8; i++) {
  maxWidthScale.push(i * 32 + "px");
}

for (let i = 4; i < 24; i++) {
  maxWidthScale.push(i * 64 + "px");
}

const stackComponentDefinition: InternalRenderableComponentDefinition<"$stack"> =
  {
    id: "$stack",
    tags: ["notrace"],
    styles: $stackStyles,
    pasteSlots: ["Items"],
    editing: ({ values, editingInfo }) => {
      console.log(editingInfo);

      const items = editingInfo.components
        .Items as Array<ChildComponentEditingInfo>;

      const fields = [...editingInfo.fields];

      return {
        fields,
        components: {
          Items: items.map((item, index) => {
            const prefix = `Items.${index}`;
            const maxWidth = item.fields.find(
              (field) => field.path === `${prefix}.width`
            )!;
            const marginBottom = item.fields.find(
              (field) => field.path === `${prefix}.marginBottom`
            )!;
            const align = item.fields.find(
              (field) => field.path === `${prefix}.align`
            )!;

            let fields;

            if (index === 0) {
              fields = [maxWidth, marginBottom];
            } else {
              const topMargin = {
                ...items[index - 1].fields.find(
                  (field) => field.path === `Items.${index - 1}.marginBottom`
                )!,
                label: "Top",
              };

              if (index !== items.length - 1) {
                fields = [maxWidth, topMargin, marginBottom];
              } else {
                fields = [maxWidth, topMargin];
              }
            }

            if (!values.passedAlign) {
              fields.push(align);
            }

            return {
              ...item,
              fields,
            };
          }),
        },
      };
    },
    schema: [
      {
        prop: "Items",
        label: "Items",
        type: "component-collection",
        componentTypes: ["item"],
        itemFields: [
          {
            prop: "width",
            label: "Max width",
            type: "select$",
            options: maxWidthScale,
            defaultValue: "512px",
            group: "Size",
          },
          {
            prop: "marginBottom",
            label: "Bottom",
            type: "space",
            group: "Margins",
          },
          {
            prop: "align",
            label: "Align",
            type: "radio-group$",
            options: [
              {
                value: "left",
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
                value: "right",
                label: "Right",
                icon: "AlignRight",
                hideLabel: true,
              },
            ],
            defaultValue: "left",
            group: "Layout",
          },
        ],
      },
    ],
  };

export { stackComponentDefinition };

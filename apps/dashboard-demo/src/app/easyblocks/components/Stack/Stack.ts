import {
  ChildComponentEditingInfo,
  NoCodeComponentDefinition,
  spacingToPx,
} from "@easyblocks/core";

const maxWidthScale = ["max"];

for (let i = 2; i < 8; i++) {
  maxWidthScale.push(i * 32 + "px");
}

for (let i = 4; i < 24; i++) {
  maxWidthScale.push(i * 64 + "px");
}

const stackDefinition: NoCodeComponentDefinition = {
  id: "Stack",
  styles({ values, params, device, isEditing }) {
    // Legacy -> if we get passedAlign from external, we use it "by force"
    if (params.passedAlign) {
      values.Items = values.Items.map((item: any) => ({
        ...item,
        align: params.passedAlign!,
      }));
    }

    // here we must apply default for placeholder!
    const items =
      values.Items.length > 0
        ? values.Items
        : [
            {
              marginBottom: 0,
              escapeMargin: false,
              width: "512px",
              align: params.passedAlign ?? "left",
            },
          ];

    const outerItemWrappers: Array<Record<string, any>> = [];
    const innerItemWrappers: Array<Record<string, any>> = [];

    items.forEach((item: any, index: number) => {
      let maxWidth = item.width;
      if (isNaN(parseInt(maxWidth))) {
        maxWidth = "10000px"; // auto when not a pixel value -> and this is the default value!
      }

      let flexAlign = "center";
      if (item.align === "left") {
        flexAlign = "flex-start";
      } else if (item.align === "right") {
        flexAlign = "flex-end";
      }

      const isChildRichText =
        "_template" in item &&
        item._template === "@easyblocks/rich-text" &&
        !isEditing;

      outerItemWrappers.push({
        display: "flex",
        justifyContent: flexAlign,
        paddingLeft: !item.escapeMargin ? params.paddingLeft : 0,
        paddingRight: !item.escapeMargin ? params.paddingRight : 0,
        paddingTop:
          (index === 0 || values.Items.length === 0) && !item.escapeMargin
            ? params.paddingTop
            : 0,
        paddingBottom:
          (index === values.Items.length - 1 || values.Items.length === 0) &&
          !item.escapeMargin
            ? params.paddingBottom
            : 0,
      });

      innerItemWrappers.push({
        position: "relative",
        maxWidth: "100%",
        width: maxWidth,
        marginBottom: index === items.length - 1 ? 0 : item.marginBottom,
        // If stack item contains $richText it doesn't have to be interactive by default.
        // If that $richText would contain action, only that part will be interactive and that is handled by $richTextInlineWrapper.
        // For now, if child is something else we enable interactivity just in case.
        pointerEvents: isChildRichText ? "none" : "auto",
      });
    });

    return {
      styled: {
        StackContainer: {
          display: "grid",
        },
        innerItemWrappers,
        outerItemWrappers,
      },

      components: {
        Items: {
          itemProps: values.Items.map((item: any) => {
            return {
              passedAlign: item.align,
              $width: Math.min(
                item.width === "max" ? Number.MAX_VALUE : parseInt(item.width),
                params.$width -
                  spacingToPx(params.paddingLeft ?? "0px", device.w) -
                  spacingToPx(params.paddingRight ?? "0px", device.w)
              ),
              $widthAuto: false,
            };
          }),
        },
      },
    };
  },
  editing({ values, editingInfo }) {
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
      accepts: ["item"],
      itemFields: [
        {
          prop: "width",
          label: "Max width",
          type: "select",
          responsive: true,
          params: {
            options: maxWidthScale,
          },
          defaultValue: "512px",
          group: "Size",
        },
        {
          prop: "marginBottom",
          label: "Bottom",
          type: "space",
          group: "Margins",
          defaultValue: {
            ref: "0",
            value: "0px",
          },
        },
        {
          prop: "align",
          label: "Align",
          type: "radio-group",
          responsive: true,
          params: {
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
          },
          defaultValue: "left",
          group: "Layout",
        },
      ],
    },
  ],
};

export { stackDefinition };

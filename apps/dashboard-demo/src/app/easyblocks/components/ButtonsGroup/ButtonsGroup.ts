import { NoCodeComponentDefinition, box } from "@easyblocks/core";

const buttonsGroupDefinition: NoCodeComponentDefinition = {
  id: "ButtonsGroup",
  type: ["item"],
  schema: [
    {
      prop: "Buttons",
      type: "component-collection",
      accepts: ["Button"],
      placeholderAppearance: {
        height: 38,
        width: 38,
      },
    },
    {
      prop: "gap",
      label: "Gap",
      type: "space",
    },
  ],
  styles({ values, params }) {
    const align = params.passedAlign || "left";
    let flexAlign = "flex-start";
    if (align === "center") {
      flexAlign = "center";
    } else if (align === "right") {
      flexAlign = "flex-end";
    }

    const gap = values.gap;

    return {
      styled: {
        ButtonsContainer: box({
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: flexAlign,
          alignItems: flexAlign,
          gap,
          pointerEvents: "auto",
        }),
      },
    };
  },
  editing: ({ values }) => {
    return {
      components: {
        Buttons: values.Buttons.map(() => ({
          direction: "horizontal",
        })),
      },
    };
  },
};

export { buttonsGroupDefinition };

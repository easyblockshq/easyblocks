import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";

export default function ({
  values,
  params,
}: NoCodeComponentStylesFunctionInput): NoCodeComponentStylesFunctionResult {
  const $width = params.$width;

  const items =
    values.Items.length > 0
      ? values.Items
      : [{ columnWidth: "fill", itemWidth: "fill", itemAlign: "flex-start" }];

  const $itemWidth = $width / items.length; // TODO: very lame interpolation, no time :(

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
      Container: {
        display: "flex",
        flexDirection: "row",
        alignItems: values.verticalAlign,
        gap: values.gap,
      },
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
}

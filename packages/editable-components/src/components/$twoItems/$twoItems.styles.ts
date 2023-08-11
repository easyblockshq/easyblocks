import { box } from "../../box";

export default function (configProps: any, t: any) {
  const $width = t.$width;

  const items =
    configProps.Items.length > 0
      ? configProps.Items
      : [{ columnWidth: "fill", itemWidth: "fill", itemAlign: "flex-start" }];

  const $itemWidth = $width / items.length; // TODO: very lame interpolation, no time :(

  const itemWrappers = items.map((x: any) => {
    return {
      OuterWrapper: box({
        display: "flex",
        flex: x.columnWidth === "fill" ? "1 1 0" : `0 0 ${x.columnWidth}px`,
        justifyContent: x.itemWidth === "fill" ? "stretch" : x.itemAlign,
      }),
      InnerWrapper: box({
        display: "grid",
        flexBasis: x.itemWidth === "fill" ? "100%" : `${x.itemWidth}px`,
      }),
    };
  });

  return {
    Container: box({
      display: "flex",
      flexDirection: "row",
      alignItems: configProps.verticalAlign,
      gap: configProps.gap,
    }),
    itemWrappers,
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
  };
}

import { box } from "../../box";
import { CompiledComponentStylesToolkit } from "../../types";

export const rootSectionStyles = (
  config: any,
  t: CompiledComponentStylesToolkit
) => {
  // We must have at least 1 item wrapper for placeholder.
  const dataProps =
    config.data.length === 0
      ? [{ topMargin: 0, bottomMargin: 0 }]
      : config.data;

  const ItemWrappers = dataProps.map((x: any, index: number) => {
    const itemWrapperStyles: Record<string, unknown> = {
      display: !t.compilationContext.isEditing && x.hide ? "none" : "block",
      paddingTop: index === 0 ? x.topMargin : 0,
      paddingBottom: x.bottomMargin,
    };

    return box(itemWrapperStyles);
  });

  const dataItemProps = config.data.map(() => {
    return {
      $width: t.$width,
      $widthAuto: false,
    };
  });

  return {
    ItemWrappers,
    data: {
      itemProps: dataItemProps,
    },
  };
};

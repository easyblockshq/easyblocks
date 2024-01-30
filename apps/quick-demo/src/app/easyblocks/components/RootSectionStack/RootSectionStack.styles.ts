import type { NoCodeComponentStylesFunction } from "@easyblocks/core";

export const rootSectionStackStyles: NoCodeComponentStylesFunction = ({
  values,
  params,
  isEditing,
}) => {
  // We must have at least 1 item wrapper for placeholder.
  const dataProps =
    values.data.length === 0
      ? [{ topMargin: 0, bottomMargin: 0 }]
      : values.data;

  const ItemWrappers = dataProps.map((x: any, index: number) => {
    const itemWrapperStyles = {
      display: !isEditing && x.hide ? "none" : "block",
      paddingTop: index === 0 ? x.topMargin : 0,
      paddingBottom: x.bottomMargin,
    };

    return itemWrapperStyles;
  });

  const dataItemProps = values.data.map(() => {
    return {
      $width: params.$width,
      $widthAuto: false,
    };
  });

  return {
    styled: {
      ItemWrappers,
    },
    components: {
      data: {
        itemProps: dataItemProps,
      },
    },
  };
};

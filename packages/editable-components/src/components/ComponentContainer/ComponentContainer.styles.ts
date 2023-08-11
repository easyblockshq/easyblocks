import { box } from "../../box";

export function componentContainerStyles(configProps: any) {
  return {
    Container: box({
      position: "relative",
      display: configProps.widthAuto ? "inline-flex" : "block",
      maxWidth: configProps.width === -1 ? "auto" : `${configProps.width}px`,
    }),
    Component: {
      $width: configProps.width,
      $widthAuto: configProps.widthAuto,
    },
  };
}

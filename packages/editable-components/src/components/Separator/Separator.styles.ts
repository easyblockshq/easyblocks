import { box } from "../../box";

export default function (configProps: { height: string; color: string }) {
  return {
    Container: box({
      minHeight: 9,
      display: "flex",
      alignItems: "center",
      position: "relative",
    }),
    Separator: box({
      height: configProps.height + "px",
      width: "100%",
      backgroundColor: configProps.color,
    }),
  };
}

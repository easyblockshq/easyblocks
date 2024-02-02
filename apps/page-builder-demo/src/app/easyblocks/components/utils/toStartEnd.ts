export function toStartEnd(
  position: "left" | "center" | "right" | "top" | "bottom"
) {
  if (position === "left" || position === "top") {
    return "start";
  } else if (position === "center") {
    return "center";
  } else if (position === "right" || position === "bottom") {
    return "end";
  }
}

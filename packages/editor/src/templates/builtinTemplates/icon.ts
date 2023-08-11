export const icon = (iconRef: string, color = "$dark") => ({
  _template: "$icon",
  icon: {
    ref: iconRef,
  },
  color: {
    $res: true,
    xl: {
      ref: color,
      value: "xxx",
    },
  },
});

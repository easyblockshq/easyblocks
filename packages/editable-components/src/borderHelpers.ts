import { SchemaProp } from "@easyblocks/core";

export const borderSchemaProps: (group: string) => SchemaProp[] = (group) => [
  {
    prop: "borderWidth",
    label: "Border width",
    type: "select",
    responsive: true,
    params: {
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "unequal"],
    },
    group,
  },
  {
    prop: "borderColor",
    label: "Border Color",
    type: "color",
    defaultValue: {
      ref: "$dark",
      value: "black",
    },
    visible: (x) => x.borderWidth !== "0",
    group,
  },
  {
    prop: "borderTop",
    label: "Border top",
    type: "select",
    responsive: true,
    params: { options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"] },
    defaultValue: "1",
    visible: (x) => x.borderWidth === "unequal",
    group,
  },
  {
    prop: "borderBottom",
    label: "Border bottom",
    type: "select",
    responsive: true,
    params: { options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"] },
    defaultValue: "1",
    visible: (x) => x.borderWidth === "unequal",
    group,
  },
  {
    prop: "borderLeft",
    label: "Border left",
    type: "select",
    responsive: true,
    params: { options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"] },
    defaultValue: "1",
    visible: (x) => x.borderWidth === "unequal",
    group,
  },
  {
    prop: "borderRight",
    label: "Border right",
    type: "select",
    responsive: true,
    params: { options: ["0", "1", "2", "3", "4", "5", "6", "7", "8"] },
    defaultValue: "1",
    visible: (x) => x.borderWidth === "unequal",
    group,
  },
  {
    prop: "boxShadow", // main image size
    label: "Box shadow",
    type: "stringToken",
    params: { tokenId: "boxShadows" },
    defaultValue: {
      ref: "none",
      value: "none",
    },
    group,
  },
];

export type BorderCompiledValues = {
  borderWidth: string;
  borderColor: string;
  borderTop: string;
  borderRight: string;
  borderBottom: string;
  borderLeft: string;
  boxShadow: string;
};

export function getBorderCSSProps(
  values: BorderCompiledValues
): Record<string, string> {
  const border: Record<string, any> = {
    boxShadow: values.boxShadow,
  };

  if (values.borderWidth !== "none") {
    if (values.borderWidth !== "unequal") {
      border.border = `${values.borderWidth}px solid ${values.borderColor}`;
    } else {
      border.borderTop = `${values.borderTop}px solid ${values.borderColor}`;
      border.borderRight = `${values.borderRight}px solid ${values.borderColor}`;
      border.borderBottom = `${values.borderBottom}px solid ${values.borderColor}`;
      border.borderLeft = `${values.borderLeft}px solid ${values.borderColor}`;
    }
  }

  return border;
}

export function getBorderInfo(values: BorderCompiledValues) {
  if (
    values.boxShadow !== "none" ||
    (values.borderWidth !== "0" && values.borderWidth !== "unequal")
  ) {
    return { top: true, right: true, bottom: true, left: true };
  }

  if (values.borderWidth === "unequal") {
    return {
      top: values.borderTop !== "0",
      right: values.borderRight !== "0",
      bottom: values.borderBottom !== "0",
      left: values.borderLeft !== "0",
    };
  }

  return {
    top: false,
    right: false,
    bottom: false,
    left: false,
  };
}

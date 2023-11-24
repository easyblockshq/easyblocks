import { SchemaProp } from "@easyblocks/core";

export function normalizePxValue(min: number, max: number) {
  return (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) {
      return "0";
    } else if (num < min) {
      return min.toString();
    } else if (num > max) {
      return max.toString();
    } else {
      return num.toString();
    }
  };
}

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

export function paddingSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "space",
    defaultValue: {
      ref: "16",
      value: "16px",
    },
  };
}

export function borderSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "string",
    params: {
      normalize: normalizePxValue(0, 32),
    },
    defaultValue: "1",
  };
}

export function snapToEdgeSchemaProp(fieldName: string): SchemaProp {
  return {
    prop: fieldName,
    type: "boolean",
  };
}

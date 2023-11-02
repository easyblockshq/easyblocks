import reduceCSSCalc from "@easyblocks/reduce-css-calc";
import { Spacing } from "./types";

type PxSpacing = {
  unit: "px";
  value: number;
};

type VwSpacing = {
  unit: "vw";
  value: number;
};

type ParsedSpacing = PxSpacing | VwSpacing;

export function parseSpacing(spacing: string): ParsedSpacing {
  if (spacing.endsWith("px")) {
    const value = parseFloat(spacing);
    if (isNaN(value)) {
      throw new Error(`incorrect spacing: ${spacing}`);
    }
    return {
      unit: "px",
      value,
    };
  }

  if (spacing.endsWith("vw")) {
    const value = parseFloat(spacing);
    if (isNaN(value)) {
      throw new Error(`incorrect spacing: ${spacing}`);
    }
    return {
      unit: "vw",
      value,
    };
  }

  throw new Error(`incorrect spacing: ${spacing}.`);
}

export function spacingToPx(spacing: Spacing, width: number): number {
  const reducedSpacing = reduceCSSCalc(
    `calc(${spacing})` /* wrapping calc is necessary, otherwise max(10px,20px) doesn't work */,
    5,
    { vw: width, percent: width }
  );

  const parsed = parseSpacing(reducedSpacing);
  if (parsed.unit === "px") {
    return parsed.value;
  }

  throw new Error("unreachable");
}

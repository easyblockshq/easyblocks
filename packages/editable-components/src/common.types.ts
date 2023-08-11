import { Spacing } from "@easyblocks/core";

export type EdgeCompiledValues = {
  edgeLeft?: boolean;
  edgeRight?: boolean;

  edgeTop?: boolean;
  edgeBottom?: boolean;

  edgeLeftMargin?: Spacing | null;
  edgeRightMargin?: Spacing | null;
};
export type GridContextCompiledValues = {
  gridBaseLineHeight?: string;
};

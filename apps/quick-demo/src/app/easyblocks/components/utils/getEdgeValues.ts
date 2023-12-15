import { Spacing } from "@easyblocks/core";

type EdgeValues = {
  edgeLeft?: boolean;
  edgeRight?: boolean;
  edgeTop?: boolean;
  edgeBottom?: boolean;
  edgeLeftMargin?: Spacing | null;
  edgeRightMargin?: Spacing | null;
};

export function getEdgeValues(
  optionalEdgeValues: Partial<EdgeValues>
): Required<EdgeValues> {
  const edgeLeft = optionalEdgeValues.edgeLeft ?? false;
  const edgeRight = optionalEdgeValues.edgeRight ?? false;
  const edgeTop = optionalEdgeValues.edgeTop ?? false;
  const edgeBottom = optionalEdgeValues.edgeBottom ?? false;
  const edgeLeftMargin = optionalEdgeValues.edgeLeftMargin ?? null;
  const edgeRightMargin = optionalEdgeValues.edgeRightMargin ?? null;

  return {
    edgeLeft,
    edgeRight,
    edgeTop,
    edgeBottom,
    edgeLeftMargin,
    edgeRightMargin,
  };
}

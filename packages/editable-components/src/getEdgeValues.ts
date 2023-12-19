import { EdgeCompiledValues } from "./common.types";

export function getEdgeValues(
  optionalEdgeValues: EdgeCompiledValues | undefined
): Required<EdgeCompiledValues> {
  const edgeLeft = optionalEdgeValues?.edgeLeft ?? false;
  const edgeRight = optionalEdgeValues?.edgeRight ?? false;
  const edgeTop = optionalEdgeValues?.edgeTop ?? false;
  const edgeBottom = optionalEdgeValues?.edgeBottom ?? false;
  const edgeLeftMargin = optionalEdgeValues?.edgeLeftMargin ?? null;
  const edgeRightMargin = optionalEdgeValues?.edgeRightMargin ?? null;

  return {
    edgeLeft,
    edgeRight,
    edgeTop,
    edgeBottom,
    edgeLeftMargin,
    edgeRightMargin,
  };
}

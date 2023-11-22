import { Spacing } from "@easyblocks/core";
import { EdgeCompiledValues } from "../../common.types";

export type GridCompiledValues = {
  Cards: any[];
  variant: string;
  numberOfItems: string;
  fractionalItemWidth: string;
  columnGap: Spacing;
  rowGap: Spacing;
  verticalAlign: "top" | "center" | "bottom";
  showSliderControls: boolean;
  shouldSliderItemsBeVisibleOnMargin: boolean;
  gridMainObjectAspectRatio: string;
  LeftArrow: any[];
  leftArrowPlacement: string;
  leftArrowOffset: Spacing;
  RightArrow: any[];
  rightArrowPlacement: string;
  rightArrowOffset: Spacing;

  borderEnabled: boolean;
  borderColor: string;
  borderTop: string;
  borderBottom: string;
  borderLeft: string;
  borderRight: string;
  borderInner: string;

  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
};

export type GridParams = EdgeCompiledValues & {
  $width: number;
  $widthAuto: boolean;
  maxWidth: null | number;
  escapeMargin: boolean;
};

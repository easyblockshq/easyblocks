import { Spacing } from "@easyblocks/core";

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
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
};

export type GridParams = {
  edgeLeft?: boolean;
  edgeRight?: boolean;
  edgeTop?: boolean;
  edgeBottom?: boolean;
  edgeLeftMargin?: Spacing | null;
  edgeRightMargin?: Spacing | null;
  $width: number;
  $widthAuto: boolean;
  maxWidth: null | number;
  escapeMargin: boolean;
};

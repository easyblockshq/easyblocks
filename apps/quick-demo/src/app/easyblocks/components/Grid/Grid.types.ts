import { Spacing } from "@easyblocks/core";
import { SectionWrapperValues } from "@/app/easyblocks/components/utils/sectionWrapper";

export type GridCompiledValues = SectionWrapperValues & {
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
  $width: number;
  $widthAuto: boolean;
};

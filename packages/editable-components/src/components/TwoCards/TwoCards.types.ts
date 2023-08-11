import { Spacing } from "@easyblocks/core";
import { EdgeCompiledValues } from "../../common.types";

export type TwoCardsCompiledValues = EdgeCompiledValues & {
  Card1: any[];
  Card2: any[];
  card1Width: string;
  card2Width: string;
  card1EscapeMargin: boolean;
  card2EscapeMargin: boolean;
  verticalLayout: string;
  verticalOffset: string;
  collapse: boolean;
  verticalGap: Spacing;
  gap: Spacing;
  invertCollapsed: boolean;
};

import { Spacing } from "@easyblocks/core";
import {
  EdgeCompiledValues,
  GridContextCompiledValues,
} from "../../common.types";
import { BorderCompiledValues } from "../../borderHelpers";

export type BasicCardCompiledValues = GridContextCompiledValues &
  BorderCompiledValues & {
    size: string;
    cornerRadius: string;
    Background: any[];
    enableContent: boolean;
    position: string;
    paddingLeft: Spacing;
    paddingRight: Spacing;
    paddingBottom: Spacing;
    paddingTop: Spacing;
    paddingLeftExternal: Spacing;
    paddingRightExternal: Spacing;
    paddingBottomExternal: Spacing;
    paddingTopExternal: Spacing;
    edgeMarginProtection: boolean;
    Stack: any[];
  };

export type BasicCardParams = EdgeCompiledValues & {
  passedSize?: string;
  passedNoBorders?: boolean;
  hideContent?: boolean;
  hideBackground?: boolean;
  useExternalPaddingLeft?: boolean;
  useExternalPaddingRight?: boolean;
  useExternalPaddingTop?: boolean;
  useExternalPaddingBottom?: boolean;
};

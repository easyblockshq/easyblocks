import { Spacing } from "@easyblocks/core";
import {
  EdgeCompiledValues,
  GridContextCompiledValues,
} from "../../common.types";
import { BorderCompiledValues } from "../../borderHelpers";

export type BasicCardCompiledValues = EdgeCompiledValues &
  GridContextCompiledValues &
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

    useExternalPaddingLeft?: boolean;
    useExternalPaddingRight?: boolean;
    useExternalPaddingTop?: boolean;
    useExternalPaddingBottom?: boolean;

    passedSize?: string;
    passedNoBorders?: boolean;
    hideContent?: boolean;
    hideBackground?: boolean;
  };

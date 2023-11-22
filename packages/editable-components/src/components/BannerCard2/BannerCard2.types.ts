import { Spacing } from "@easyblocks/core";
import { GridContextCompiledValues } from "../../common.types";
import { BorderCompiledValues } from "../../borderHelpers";

export type BannerCard2CompiledValues = GridContextCompiledValues &
  BorderCompiledValues & {
    cornerRadius: string;
    Card1: any[];
    Card2: any[];
    mode: string;
    sideModeWidth: string;
    backgroundModePosition: string;
    backgroundModePaddingLeft: Spacing;
    backgroundModePaddingRight: Spacing;
    backgroundModePaddingTop: Spacing;
    backgroundModePaddingBottom: Spacing;
    backgroundModeEdgeMarginProtection: boolean;
    action: any[];

    boxShadow: string;
  };

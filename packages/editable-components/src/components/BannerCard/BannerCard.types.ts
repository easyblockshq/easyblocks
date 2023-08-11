import { Spacing } from "@easyblocks/core";
import {
  EdgeCompiledValues,
  GridContextCompiledValues,
} from "../../common.types";

export type BannerCardCompiledValues = EdgeCompiledValues &
  GridContextCompiledValues & {
    cornerRadius: string;
    SideImage: any[];
    sideImagePosition: string;
    sideImageSize: string;
    size: string;
    contentPositionInBackgroundMode: string;
    contentHorizontalMarginInBackgroundMode: Spacing;
    contentVerticalMarginInBackgroundMode: Spacing;
    Background: any[];
    offsetHorizontal: Spacing;
    offsetHorizontalForVerticalImagePosition: Spacing;
    offsetVertical: Spacing;
    Stack: any[];
    stackAlign: string;
    positionHorizontal: string;
    verticalAlign: string;
    action: any[];
  };

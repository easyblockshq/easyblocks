// import { mapAlignmentToFlexAlignment } from "../$richText.styles";
import { Alignment } from "../$richText.types";
import type { RichTextBlockElementType } from "../$richTextBlockElement/$richTextBlockElement";
import {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "../../../../types";

export type RichTextLineCompiledComponentValues = {
  align: Alignment;
};

export type RichTextLineParams = {
  blockType: RichTextBlockElementType;
};

export function richTextLineElementStyles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput<
  RichTextLineCompiledComponentValues,
  RichTextLineParams
>): NoCodeComponentStylesFunctionResult {
  return {
    // styled: {
    //   TextLine: {
    //     lineHeight: "initial",
    //     wordBreak: "break-word",
    //   },
    //   ListItem: {
    //     __as: "li",
    //     // display: "flex",
    //     // justifyContent: mapAlignmentToFlexAlignment(values.align),
    //     // paddingLeft: 0,
    //     alignItems: "baseline",
    //     lineHeight: "inherit",
    //     wordBreak: "break-word",
    //     listStyle: "inherit",
    //     counterIncrement: "list-item",

    //     // ...params.mainColor
    //     // Allows flex items to break when text is overflowing
    //     // "& > *": {
    //     //   minWidth: 0,
    //     // },
    //   },
    // },

    props: {
      blockType: params.blockType,
    },
  };
}

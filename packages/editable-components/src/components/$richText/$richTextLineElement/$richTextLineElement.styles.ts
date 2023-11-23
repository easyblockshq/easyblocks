import type { Alignment } from "@easyblocks/app-utils";
import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { mapAlignmentToFlexAlignment } from "../$richText.styles";
import type { RichTextBlockElementType } from "../$richTextBlockElement/$richTextBlockElement";

export type RichTextLineCompiledComponentValues = {
  align: Alignment;
};

export type RichTextLineParams = {
  blockType: RichTextBlockElementType;
};

export default function styles({
  values,
  params,
}: NoCodeComponentStylesFunctionInput<
  RichTextLineCompiledComponentValues,
  RichTextLineParams
>): NoCodeComponentStylesFunctionResult {
  return {
    styled: {
      TextLine: {
        lineHeight: "initial",
        wordBreak: "break-word",
      },
      ListItem: {
        __as: "li",
        display: "flex",
        justifyContent: mapAlignmentToFlexAlignment(values.align),
        alignItems: "baseline",
        paddingLeft: 0,
        lineHeight: "initial",
        wordBreak: "break-word",
        listStyle: "none",
        counterIncrement: "list-item",
        // Allows flex items to break when text is overflowing
        "& > *": {
          minWidth: 0,
        },
      },
    },

    props: {
      blockType: params.blockType,
    },
  };
}

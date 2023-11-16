import { Alignment } from "@easyblocks/app-utils";
import { NoCodeComponentStylesFunctionInput } from "@easyblocks/core";
import { mapAlignmentToFlexAlignment } from "../$richText.styles";
import { RichTextBlockElementType } from "../$richTextBlockElement/$richTextBlockElement";
import { box } from "../../../box";

export type RichTextLineCompiledComponentValues = {
  align: Alignment;
  blockType: RichTextBlockElementType;
};

export default function styles({
  values,
}: NoCodeComponentStylesFunctionInput<RichTextLineCompiledComponentValues>) {
  return {
    TextLine: box(
      {
        lineHeight: "initial",
        wordBreak: "break-word",
      },
      "div"
    ),
    ListItem: box(
      {
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
      "li"
    ),
    __props: {
      blockType: values.blockType,
    },
  };
}

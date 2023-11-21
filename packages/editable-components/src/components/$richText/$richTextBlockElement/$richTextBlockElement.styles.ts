import type { Alignment } from "@easyblocks/app-utils";
import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import type { RichTextAccessibilityRole } from "../$richText";
import type { RichTextPartCompiledComponentConfig } from "../$richTextPart/$richTextPart";
import type { RichTextBlockElementType } from "./$richTextBlockElement";

export type RichTextBlockElementValues = {
  elements: Array<{ elements: Array<RichTextPartCompiledComponentConfig> }>;
  type: RichTextBlockElementType;
};

function px(value: string | number) {
  if (typeof value === "number") {
    return value === 0 ? "0" : `${value}px`;
  }

  return value;
}

const BULLETED_LIST_MIN_INLINE_SPACING = 8;
const NUMBERED_LIST_MIN_COUNTER_SPACING = 8;
const NUMBERED_LIST_MAX_COUNTER_SPACING = "0.5ch";
/**
 * Numbered list consists of number and dot. We can safely calculate required space for number by
 * counting digits of list length and using `ch` unit. Dot character differentiate between fonts
 * and we reserve at least 0.5ch of space.
 */
const NUMBERED_LIST_DOT_CHARACTER_SAFE_WIDTH = "0.5ch";
const BULLET_CHARACTER = "\u2022";

export type RichTextBlockElementParams = {
  accessibilityRole: RichTextAccessibilityRole;
  align: Alignment;
  mainColor: string;
  mainFont: Record<string, any>;
  mainFontSize: string | number;
};

export default function styles({
  values: { elements, type },
  params: { accessibilityRole, align, mainColor, mainFont, mainFontSize },
}: NoCodeComponentStylesFunctionInput<
  RichTextBlockElementValues,
  RichTextBlockElementParams
>): NoCodeComponentStylesFunctionResult {
  const maxDigitsCount = elements.length.toString().length;

  const paddingInline = `clamp(${px(
    BULLETED_LIST_MIN_INLINE_SPACING
  )}, calc(${px(mainFontSize)} * 0.5), ${px(mainFontSize)})`;

  const bulletedListMarkerStyles = {
    paddingLeft: paddingInline,
    paddingRight: paddingInline,
    content: BULLET_CHARACTER,
  };

  const numberedListMarkerStyles = {
    minWidth: `calc(${maxDigitsCount} * 1ch + ${NUMBERED_LIST_DOT_CHARACTER_SAFE_WIDTH})`,
    paddingRight: `clamp(${px(
      NUMBERED_LIST_MIN_COUNTER_SPACING
    )}, 0.5ch, ${NUMBERED_LIST_MAX_COUNTER_SPACING})`,
    fontVariantNumeric: "tabular-nums",
    textAlign: "right",
    content: `counter(list-item)"."`,
  };

  const markerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 0,
    flexShrink: 0,
    fontSize: mainFontSize,
    ...(type === "bulleted-list"
      ? bulletedListMarkerStyles
      : numberedListMarkerStyles),
  };

  const listStyles = {
    counterSet: "list-item",
    paddingLeft: 0,
    listStyle: "none",
    color: mainColor,
    ...mainFont,
    "& > li": {
      color: mainColor,
      ...mainFont,
      // Instead of using ::marker pseudo-element, we use ::before because it gives us more control over its appearance.
      "&::before": markerStyles,
    },
  };

  return {
    styled: {
      Paragraph: { __as: accessibilityRole },
      BulletedList: { __as: "ul", ...listStyles },
      NumberedList: { __as: "ol", ...listStyles },
    },
    components: {
      elements: {
        itemProps: elements.map(() => ({
          blockType: type,
          align,
        })),
      },
    },
  };
}

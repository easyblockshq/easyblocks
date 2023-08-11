import { InternalTextModifierDefinition } from "@easyblocks/app-utils";

const inlineCodeTextModifier: InternalTextModifierDefinition = {
  id: "$InlineCodeTextModifier",
  label: "Inline code",
  schema: [],
  tags: ["textModifier"],
  apply: ({ elements }) => {
    const fontSizes = elements.map((element: Record<string, any>) =>
      typeof element.font.fontSize === "number"
        ? `${element.font.fontSize}px`
        : element.font.fontSize
    );

    return {
      display: "inline",
      padding: "0.1em 0.3em !important",
      fontSize: `calc(max(${fontSizes.join(",")}) * 0.8)`,
      background: "rgba(135,131,120,0.15)",
      borderRadius: 3,
    };
  },
  childApply: () => {
    return {
      color: "#EB5757",
      fontFamily: "monospace",
      fontSize: "1em",
      lineHeight: "inherit",
    };
  },
};

export { inlineCodeTextModifier };

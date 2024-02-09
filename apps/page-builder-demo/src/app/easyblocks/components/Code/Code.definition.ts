import { NoCodeComponentDefinition } from "@easyblocks/core";

const codeDefinition: NoCodeComponentDefinition = {
  id: "Code",
  type: "@easyblocks/text-wrapper",
  schema: [],
  styles() {
    return {
      styled: {
        Wrapper: {
          __as: "span",
          padding: "0.1em 0.3em",
          background: "rgba(135,131,120,0.15)",
          borderRadius: 3,
          color: "#EB5757",
          fontFamily: "monospace",
          fontSize: "0.8em",
        },
      },
    };
  },
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_text.png",
};

export { codeDefinition };

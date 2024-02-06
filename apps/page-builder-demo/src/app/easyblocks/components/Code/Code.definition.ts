import { NoCodeComponentDefinition } from "@easyblocks/core";

const codeDefinition: NoCodeComponentDefinition = {
  id: "Code",
  type: "@easyblocks/text-wrapper",
  schema: [],
  styles() {
    return {
      styled: {
        Wrapper: {
          display: "inline",
          padding: "0.1em 0.3em",
          background: "rgba(135,131,120,0.15)",
          borderRadius: 3,
          color: "#EB5757",
          fontFamily: "monospace",
        },
      },
    };
  },
};

export { codeDefinition };

import type { NoCodeComponentStylesFunctionResult } from "@easyblocks/core";
/**
 * Playground purpose is to have as many use cases as possible for tests
 */

function styles(): NoCodeComponentStylesFunctionResult {
  return {
    styled: {
      Root: {
        position: "relative",
        top: 100,
      },
      Span: {
        __as: "span",
        position: "relative",
        right: 50,
      },

      ActionElement: {
        __action: "action",
        left: 100,
      },
    },
  };
}

export default styles;

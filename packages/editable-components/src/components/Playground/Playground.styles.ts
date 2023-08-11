import { box } from "../../box";
/**
 * Playground purpose is to have as many use cases as possible for tests
 */

function styles() {
  return {
    Root: box({
      position: "relative",
      top: 100,
    }),
    Span: box(
      {
        position: "relative",
        right: 50,
      },
      "span"
    ),
    ActionElement: box({
      __action: "action",
      left: 100,
    }),
  };
}

export default styles;

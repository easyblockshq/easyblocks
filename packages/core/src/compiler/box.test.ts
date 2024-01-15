import { testDevices } from "../testUtils";
import { getBoxStyles } from "./box";

test("corrects order of non responsive and breakpoint properties (from highest breakpoint, to lowest)", () => {
  const styles = getBoxStyles(
    {
      "@b1": {
        textAlign: "left",
      },
      textAlign: "center",
      "@b3": {
        textAlign: "right",
      },
    },
    testDevices
  );

  expect(styles).toStrictEqual({
    "@media (max-width: 349px)": {
      textAlign: "right",
    },
    textAlign: "center",
    "@media (max-width: 149px)": {
      textAlign: "left",
    },
  });
});

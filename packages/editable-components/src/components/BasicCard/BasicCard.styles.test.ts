import { testCompilationContext } from "../../test-utils";
import styles from "./BasicCard.styles";

const basicCardValues = {
  position: "center-center",
  paddingLeft: "10px",
  paddingRight: "11px",
  paddingTop: "20px",
  paddingBottom: "21px",
  enableContent: true,
  Background: [],
};

function runStyles(extraValues: any) {
  return styles(
    { ...basicCardValues, ...extraValues },
    {
      $width: 600,
      $widthAuto: false,
      compilationContext: testCompilationContext,
      device: testCompilationContext.devices.find(
        (device) => device.id === "b4"
      )!,
    }
  );
}

describe("BasicCard stack parameters", () => {
  test("no edge margins", () => {
    const compiled = runStyles({
      positionContext: "left",
    });
    expect(compiled.Stack.$width).toBe(600);
    expect(compiled.Stack.$widthAuto).toBe(true);
  });
});

import { DeviceRange } from "@easyblocks/core";
import { testCompilationContext } from "../../test-utils";
import styles from "./$stack.styles";
import { StackCompiledValues } from "./Stack.types";

const stackValues: StackCompiledValues = {
  Items: [
    {
      _template: "$Component1",
      width: "256px",
      align: "left",
      marginBottom: "0px",
    },
    {
      _template: "$Component2",
      width: "max",
      align: "center",
      marginBottom: "0px",
    },
    {
      _template: "$Component3",
      width: "640px",
      align: "center",
      marginBottom: "0px",
    },
  ],
  paddingLeft: "20px",
  paddingRight: "30px",
  paddingTop: "40px",
  paddingBottom: "50px",
  passedAlign: undefined,
};

function runStyles(extraValues: Record<string, any> = {}): any {
  const device: DeviceRange = {
    id: "xl",
    w: 1920,
    h: 800,
    breakpoint: null,
  };

  return styles(
    { ...stackValues, ...extraValues },
    {
      $width: 600,
      $widthAuto: false,
      compilationContext: testCompilationContext,
      device,
    }
  );
}

describe("stack item parameters", () => {
  test("work", () => {
    const compiled = runStyles({});

    expect(compiled.Items.itemProps[0].$width).toBe(256);
    expect(compiled.Items.itemProps[0].$widthAuto).toBe(false);

    expect(compiled.Items.itemProps[1].$width).toBe(600 - 30 - 20);
    expect(compiled.Items.itemProps[1].$widthAuto).toBe(false);

    expect(compiled.Items.itemProps[2].$width).toBe(600 - 30 - 20);
    expect(compiled.Items.itemProps[2].$widthAuto).toBe(false);
  });

  test('it sets pointerEvents to "none" if the child of stack is @easyblocks/rich-text', () => {
    const compiled = runStyles({
      ...stackValues,
      Items: [
        {
          _template: "@easyblocks/rich-text",
          width: "256px",
          align: "left",
          marginBottom: "0px",
        },
        {
          _template: "$Component1",
          width: "256px",
          align: "left",
          marginBottom: "0px",
        },
      ],
    });

    expect(compiled.itemWrappers[0].StackItemInner.pointerEvents).toBe("none");
    expect(compiled.itemWrappers[1].StackItemInner.pointerEvents).toBe("auto");
  });
});

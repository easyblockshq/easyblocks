import {
  RefValue,
  ResponsiveValue,
  Spacing,
  TrulyResponsiveValue,
} from "@easyblocks/core";
import {
  getDevicesWidths,
  parseSpacing,
  CompilationContextType,
} from "@easyblocks/app-utils";
import { linearizeSpace } from "./linearizeSpace";
import { testCompilationContext as testCompilationContextTemplate } from "@easyblocks/app-test-utils";

const testEditorContext = {
  ...testCompilationContextTemplate,
  theme: {
    ...testCompilationContextTemplate.theme,
    space: {},
  },
};

const devicesWidths = getDevicesWidths(testEditorContext.devices);

const editorContextWithTokens: CompilationContextType = {
  ...testEditorContext,
  theme: {
    ...testEditorContext.theme,
    space: {
      0: { value: "0px", type: "dev" },
      1: { value: "1px", type: "dev" },
      2: { value: "2px", type: "dev" },
      4: { value: "4px", type: "dev" },
      6: { value: "6px", type: "dev" },
      8: { value: "8px", type: "dev" },
      12: { value: "12px", type: "dev" },
      16: { value: "16px", type: "dev" },
      24: { value: "24px", type: "dev" },
      32: { value: "32px", type: "dev" },
      48: { value: "48px", type: "dev" },
      64: { value: "64px", type: "dev" },
      96: { value: "96px", type: "dev" },
      128: { value: "128px", type: "dev" },
      160: { value: "160px", type: "dev" },
      // prefixed spaces are important because they shouldn't be taken into account when snapping
      "prefixed.8": { value: "8px", type: "dev" },
      "prefixed.12": { value: "12px", type: "dev" },
      "prefixed.16": { value: "16px", type: "dev" },
      "prefixed.24": { value: "24px", type: "dev" },
      "prefixed.32": { value: "32px", type: "dev" },
      // responsive space shouldn't be applied in snapping
      responsiveSpace: {
        type: "dev",
        value: {
          $res: true,
          b1: "8px",
          b2: "16px",
          b3: "24px",
          b4: "48px",
          b5: "64px",
        },
      },
    },
  },
};

function expectValueToBeCloseTo(val: any, expected: number) {
  expect(typeof val).toBe("string");
  const parsed = parseSpacing(val);
  expect(parsed.unit).toBe("px");
  expect(parsed.value).toBeCloseTo(expected);
}

test("doesn't modify non-responsive value", () => {
  expect(
    linearizeSpace(
      {
        value: "10px",
      },
      testEditorContext,
      devicesWidths
    )
  ).toEqual({ value: "10px" });

  expect(
    linearizeSpace(
      {
        ref: "xxx",
        value: "10px",
      },
      testEditorContext,
      devicesWidths
    )
  ).toEqual({ ref: "xxx", value: "10px" });
});

test("single responsive token fills all the values", () => {
  const responsiveToken: RefValue<ResponsiveValue<Spacing>> = {
    ref: "xxx",
    value: { $res: true, b1: "10px", b4: "20px" },
  };

  const result = linearizeSpace(
    { $res: true, b4: responsiveToken },
    testEditorContext,
    devicesWidths
  );
  expect(result).toEqual({
    $res: true,
    b1: responsiveToken,
    b2: responsiveToken,
    b3: responsiveToken,
    b4: responsiveToken,
    b5: responsiveToken,
  });
});

test("vw token single", () => {
  const responsiveToken: RefValue<ResponsiveValue<Spacing>> = {
    ref: "xxx",
    value: { $res: true, b4: "10vw" },
  };

  const result = linearizeSpace(
    { $res: true, b4: responsiveToken },
    testEditorContext,
    devicesWidths
  );
  expect(result).toEqual({
    $res: true,
    b1: responsiveToken,
    b2: responsiveToken,
    b3: responsiveToken,
    b4: responsiveToken,
    b5: responsiveToken,
  });
});

test("two responsive tokens fill all the undefined values correctly", () => {
  const responsiveToken1: RefValue<ResponsiveValue<Spacing>> = {
    ref: "xxx",
    value: { $res: true, b1: "10px", b4: "20px" },
  };

  const responsiveToken2: RefValue<ResponsiveValue<Spacing>> = {
    ref: "yyy",
    value: { $res: true, b1: "20px", b4: "50px" },
  };

  const result = linearizeSpace(
    { $res: true, b2: responsiveToken1, b4: responsiveToken2 },
    testEditorContext,
    devicesWidths
  );
  expect(result).toEqual({
    $res: true,
    b1: responsiveToken1,
    b2: responsiveToken1,
    b3: responsiveToken2,
    b4: responsiveToken2,
    b5: responsiveToken2,
  });
});

function defaultLinearValue(
  width: number,
  value: number,
  newWidth: number,
  constant = 0
) {
  if (value <= constant) {
    return value;
  }

  const a = (value - constant) / width;
  return a * newWidth + constant;
}

test("single non-responsive token uses built-in linearity", () => {
  const b4Val = { ref: "xxx", value: "100px" };

  const result: any = linearizeSpace(
    { b4: b4Val, $res: true },
    testEditorContext,
    devicesWidths
  );

  expectValueToBeCloseTo(result.b1.value, defaultLinearValue(400, 100, 100));
  expectValueToBeCloseTo(result.b2.value, defaultLinearValue(400, 100, 200));
  expectValueToBeCloseTo(result.b3.value, defaultLinearValue(400, 100, 300));
  expect(result.b4).toEqual(b4Val);
  expectValueToBeCloseTo(result.b5.value, defaultLinearValue(400, 100, 500));
});

test("linearity works with 2 defined values and non-defined in-between", () => {
  const b1Val = { ref: "xxx", value: "10px" };
  const b5Val = { ref: "yyy", value: "50px" };

  expect(
    linearizeSpace(
      { b1: b1Val, b5: b5Val, $res: true },
      testEditorContext,
      devicesWidths
    )
  ).toEqual({
    b1: b1Val,
    b2: { value: "20px" },
    b3: { value: "30px" },
    b4: { value: "40px" },
    b5: b5Val,
    $res: true,
  });
});

test("linearity works with 2 defined values, correct in-between linearity and edge linearity", () => {
  const b1Val = { ref: "xxx", value: "10px" };
  const b3Val = { ref: "yyy", value: "20px" };

  const result: any = linearizeSpace(
    { b1: b1Val, b3: b3Val, $res: true },
    testEditorContext,
    devicesWidths
  );

  expect(result.b1).toEqual(b1Val);
  expect(result.b2).toEqual({ value: "15px" });
  expect(result.b3).toEqual(b3Val);
  expectValueToBeCloseTo(result.b4.value, defaultLinearValue(300, 20, 400));
  expectValueToBeCloseTo(result.b5.value, defaultLinearValue(300, 20, 500));
});

test("linearity works with 2 defined values, correct in-between linearity and edge linearity + constant", () => {
  const b2Val = { ref: "xxx", value: "10px" };
  const b4Val = { ref: "yyy", value: "20px" };

  const constant = 4;

  const result: any = linearizeSpace(
    { b2: b2Val, b4: b4Val, $res: true },
    testEditorContext,
    devicesWidths,
    constant
  );

  expectValueToBeCloseTo(
    result.b1.value,
    defaultLinearValue(200, 10, 100, constant)
  );

  expect(result.b2).toEqual(b2Val);
  expect(result.b3).toEqual({ value: "15px" });
  expect(result.b4).toEqual(b4Val);

  expectValueToBeCloseTo(
    result.b5.value,
    defaultLinearValue(400, 20, 500, constant)
  );
});

test("If value is smaller than constant, then it should be preserved", () => {
  const b2Val = { ref: "xxx", value: "10px" };
  const b4Val = { ref: "yyy", value: "20px" };

  const constant = 40;

  const result: any = linearizeSpace(
    { b2: b2Val, b4: b4Val, $res: true },
    testEditorContext,
    devicesWidths,
    constant
  );

  expect(result.b1).toEqual({ value: "10px" });
  expect(result.b2).toEqual(b2Val);
  expect(result.b3).toEqual({ value: "15px" });
  expect(result.b4).toEqual(b4Val);
  expect(result.b5).toEqual({ value: "20px" });
});

test("All values identical based on auto (rare)", () => {
  const b5Val = { ref: "yyy", value: "20px" };

  const constant = 40;

  const result: any = linearizeSpace(
    { b5: b5Val, $res: true },
    testEditorContext,
    devicesWidths,
    constant
  );

  expect(result.b1).toEqual({ value: "20px" });
  expect(result.b2).toEqual({ value: "20px" });
  expect(result.b3).toEqual({ value: "20px" });
  expect(result.b4).toEqual({ value: "20px" });
  expect(result.b5).toEqual(b5Val);
});

test("linearity works correctly on edges", () => {
  const b3Val = { ref: "yyy", value: "30px" };
  const b4Val = { ref: "xxx", value: "40px" };

  const result: any = linearizeSpace(
    { b3: b3Val, b4: b4Val, $res: true },
    testEditorContext,
    devicesWidths
  );
  expectValueToBeCloseTo(result.b1.value, defaultLinearValue(300, 30, 100));
  expectValueToBeCloseTo(result.b2.value, defaultLinearValue(300, 30, 200));
  expect(result.b3).toEqual(b3Val);
  expect(result.b4).toEqual(b4Val);
  expectValueToBeCloseTo(result.b5.value, defaultLinearValue(400, 40, 500));
});

test("linearity works with 2 defined values and non-defined upper", () => {
  const b1Val = { ref: "yyy", value: "10px" };
  const b2Val = { ref: "xxx", value: "20px" };

  const result: any = linearizeSpace(
    { b1: b1Val, b2: b2Val, $res: true },
    testEditorContext,
    devicesWidths
  );

  expect(result.b1).toEqual(b1Val);
  expect(result.b2).toEqual(b2Val);
  expectValueToBeCloseTo(result.b3.value, defaultLinearValue(200, 20, 300));
  expectValueToBeCloseTo(result.b4.value, defaultLinearValue(200, 20, 400));
  expectValueToBeCloseTo(result.b5.value, defaultLinearValue(200, 20, 500));
});

test("two neighbouring equal values result in all equal in between", () => {
  const b1Val = { value: "10px" };
  const value20 = { value: "20px" };

  expect(
    linearizeSpace(
      { b1: b1Val, b2: value20, b5: value20, $res: true },
      testEditorContext,
      devicesWidths
    )
  ).toEqual({
    b1: b1Val,
    b2: value20,
    b3: value20,
    b4: value20,
    b5: value20,
    $res: true,
  });
});

test("complex case of linearization", () => {
  const b1Val = { value: "29px" };
  const b2Val = { value: "30px" };
  const b4Val = { value: "34px" };

  const result: any = linearizeSpace(
    { b1: b1Val, b2: b2Val, b4: b4Val, $res: true },
    testEditorContext,
    devicesWidths
  );

  expect(result.b1).toEqual(b1Val);
  expect(result.b2).toEqual(b2Val);
  expect(result.b3).toEqual({ value: "32px" });
  expect(result.b4).toEqual(b4Val);
  expectValueToBeCloseTo(result.b5.value, defaultLinearValue(400, 34, 500));
});

test("complex case of linearization 2", () => {
  const b1Val = { value: "10px" };
  const b3Val = { value: "20px" };
  const b5Val = { value: "22px" };

  expect(
    linearizeSpace(
      { b1: b1Val, b3: b3Val, b5: b5Val, $res: true },
      testEditorContext,
      devicesWidths
    )
  ).toEqual({
    b1: b1Val,
    b2: { value: "15px" },
    b3: b3Val,
    b4: { value: "21px" },
    b5: b5Val,
    $res: true,
  });
});

/**
 * If for some reason (usually error) user set higher value for lower breakpoint (like md: 48, lg: 24), then we don't linearize. We flatten.
 */
test("linear function can be only ascending (with width, bigger widths -> bigger values).", () => {
  const b1Val = { ref: "xxx", value: "50px" };
  const b5Val = { ref: "yyy", value: "10px" };

  expect(
    linearizeSpace(
      { b1: b1Val, b5: b5Val, $res: true },
      testEditorContext,
      devicesWidths
    )
  ).toEqual({
    b1: b1Val,
    b2: { value: "10px" },
    b3: { value: "10px" },
    b4: { value: "10px" },
    b5: b5Val,
    $res: true,
  });
});

describe("custom widths (reversed)", () => {
  test("simple test", () => {
    const b1Val = { ref: "xxx", value: "30px" };
    const b4Val = { ref: "yyy", value: "40px" };

    const result: any = linearizeSpace(
      { b1: b1Val, b4: b4Val, $res: true },
      testEditorContext,
      {
        $res: true,
        b1: 300,
        b2: 340,
        b3: 400,
        b4: 400,
        b5: 450,
      }
    );

    expect(result).toMatchObject({
      b1: b1Val,
      b2: { value: "34px" },
      b3: { value: "40px" },
      b4: b4Val,
      $res: true,
    });
    expectValueToBeCloseTo(result.b5.value, defaultLinearValue(400, 40, 450));
  });

  test("linearity works with 2 different values defined for equal widths", () => {
    const b2Val = { ref: "yyy", value: "30px" };
    const b3Val = { ref: "xxx", value: "31px" };

    const result: any = linearizeSpace(
      { b2: b2Val, b3: b3Val, $res: true },
      testEditorContext,
      {
        $res: true,
        b1: 100,
        b2: 100,
        b3: 100,
        b4: 400,
        b5: 400,
      }
    );

    expect(result.b1).toEqual({ value: "30px" });
    expect(result.b2).toEqual(b2Val);
    expect(result.b3).toEqual(b3Val);
    expectValueToBeCloseTo(result.b4.value, defaultLinearValue(100, 31, 400));
    expectValueToBeCloseTo(result.b5.value, defaultLinearValue(100, 31, 400));
  });

  const nonDeviceWidths: TrulyResponsiveValue<number> = {
    $res: true,
    b1: 100,
    b2: 200,
    b3: 350,
    b4: 400,
    b5: 400,
  };

  test("complex case of linearization", () => {
    const b1Val = { value: "29px" };
    const b2Val = { value: "30px" };
    const b4Val = { value: "34px" };

    const result: any = linearizeSpace(
      { b1: b1Val, b2: b2Val, b4: b4Val, $res: true },
      testEditorContext,
      nonDeviceWidths
    );

    expect(result).toEqual({
      b1: b1Val,
      b2: b2Val,
      b3: { value: "33px" },
      b4: b4Val,
      b5: b4Val,
      $res: true,
    });
  });

  test("complex case of linearization 2", () => {
    const b1Val = { value: "10px" };
    const b3Val = { value: "20px" };
    const b5Val = { value: "22px" };

    expect(
      linearizeSpace(
        { b1: b1Val, b3: b3Val, b5: b5Val, $res: true },
        testEditorContext,
        nonDeviceWidths
      )
    ).toEqual({
      b1: b1Val,
      b2: { value: "14px" },
      b3: b3Val,
      b4: b5Val,
      b5: b5Val,
      $res: true,
    });
  });
});

describe("snapping", () => {
  test("snapping to token works, rounding up", () => {
    const b1Val = { ref: "xxx", value: "10px" };
    const b5Val = { ref: "yyy", value: "50px" };

    const result: any = linearizeSpace(
      { b1: b1Val, b5: b5Val, $res: true },
      editorContextWithTokens,
      devicesWidths
    );

    expect(result).toEqual({
      b1: b1Val,
      b2: { ref: "24", value: "24px" },
      b3: { ref: "32", value: "32px" },
      b4: { ref: "48", value: "48px" },
      b5: b5Val,
      $res: true,
    });
  });

  test("snapped token value can never be higher than higher defined value and lower than lower defined value", () => {
    const b2Val = { value: "10px" };
    const b4Val = { value: "11px" };
    const constant = 12;

    // in this scenario all values should be 11px and it's not possible to snap this, because there is not 11px token
    const result: any = linearizeSpace(
      { b2: b2Val, b4: b4Val, $res: true },
      editorContextWithTokens,
      devicesWidths,
      constant
    );

    expect(result).toEqual({
      b1: b2Val,
      b2: b2Val,
      b3: { value: "10.5px" }, // there's no token between 10 and 11
      b4: b4Val,
      b5: b4Val,
      $res: true,
    });
  });

  test("0 should be always 0", () => {
    const b3Val = { ref: "yyy", value: "0px" };

    const result: any = linearizeSpace(
      { b3: b3Val, $res: true },
      editorContextWithTokens,
      devicesWidths,
      16
    );

    expect(result.b1).toEqual({ value: "0px" });
    expect(result.b2).toEqual({ value: "0px" });
    expect(result.b3).toEqual(b3Val);
    expect(result.b4).toEqual({ value: "0px" });
    expect(result.b5).toEqual({ value: "0px" });
  });

  test("value that is lower than constant should make all values equal to that constant", () => {
    const b3Val = { value: "11px" };

    const result: any = linearizeSpace(
      { b3: b3Val, $res: true },
      editorContextWithTokens,
      devicesWidths,
      16
    );

    expect(result.b1).toEqual(b3Val);
    expect(result.b2).toEqual(b3Val);
    expect(result.b3).toEqual(b3Val);
    expect(result.b4).toEqual(b3Val);
    expect(result.b5).toEqual(b3Val);
  });
});

test("linearisation is not turned on when there is no $width defined", () => {
  const b2Val = { ref: "xxx", value: "10px" };
  const b4Val = { ref: "yyy", value: "20px" };

  const result: any = linearizeSpace(
    { b2: b2Val, b4: b4Val, $res: true },
    testEditorContext,
    { $res: true, b1: -1, b2: -1, b3: -1, b4: -1, b5: -1 }
  );

  expect(result.b1).toEqual(b2Val);
  expect(result.b2).toEqual(b2Val);
  expect(result.b3).toEqual(b4Val);
  expect(result.b4).toEqual(b4Val);
  expect(result.b5).toEqual(b4Val);
});

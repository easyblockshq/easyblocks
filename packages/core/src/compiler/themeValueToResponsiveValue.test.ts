import { Devices, TrulyResponsiveValue } from "../types";
import { themeScalarValueToResponsiveValue } from "./themeValueToResponsiveValue";

const devices: Devices = [
  {
    id: "b1",
    w: 100,
    h: 100,
    breakpoint: 150,
  },
  {
    id: "b2",
    w: 200,
    h: 200,
    breakpoint: 250,
  },
  {
    id: "b3",
    w: 300,
    h: 300,
    breakpoint: 350,
  },
  {
    id: "b4",
    w: 400,
    h: 400,
    breakpoint: 450,
  },
  {
    id: "b5",
    w: 500,
    h: 500,
    breakpoint: null,
  },
];

describe("themeScalarValueToResponsiveValue", () => {
  test("works with input theme scalar value", () => {
    expect(themeScalarValueToResponsiveValue(10, devices)).toBe(10);
    expect(themeScalarValueToResponsiveValue("xxx", devices)).toBe("xxx");
  });

  test("keeps being responsive with single breakpoint defined", () => {
    expect(
      themeScalarValueToResponsiveValue({ $res: true, b4: 20 }, devices)
    ).toEqual({
      $res: true,
      b4: 20,
    });
  });

  test("works with input theme object of scalars", () => {
    expect(
      themeScalarValueToResponsiveValue({ $res: true, b1: 10, b5: 20 }, devices)
    ).toEqual({ $res: true, b1: 10, b5: 20 });
    expect(
      themeScalarValueToResponsiveValue(
        { $res: true, b1: "xxx", b3: "yyy" },
        devices
      )
    ).toEqual({ $res: true, b1: "xxx", b3: "yyy" });
    expect(
      themeScalarValueToResponsiveValue(
        { $res: true, b1: { $res: true, a: 10 }, b3: { b: 20 } },
        devices
      )
    ).toEqual({ $res: true, b1: { $res: true, a: 10 }, b3: { b: 20 } });
  });

  test("trims non-breakpoint values", () => {
    const result = themeScalarValueToResponsiveValue<number>(
      { $res: true, b1: 10, b5: 20, xxx: 30 },
      devices
    ) as TrulyResponsiveValue<number>;

    expect(result).toEqual({ $res: true, b1: 10, b5: 20 });

    expect(result.xxx).toBeUndefined();
  });

  test("properly works with 0 value", () => {
    expect(
      themeScalarValueToResponsiveValue({ $res: true, b1: 0, b4: 20 }, devices)
    ).toEqual({ $res: true, b1: 0, b4: 20 });
  });
});

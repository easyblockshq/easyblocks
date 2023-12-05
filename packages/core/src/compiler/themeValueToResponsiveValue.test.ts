import { Devices, TrulyResponsiveValue } from "../types";
import {
  themeObjectValueToResponsiveValue,
  themeScalarValueToResponsiveValue,
} from "./themeValueToResponsiveValue";

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
    expect(themeScalarValueToResponsiveValue({ "@b4": 20 }, devices)).toEqual({
      $res: true,
      b4: 20,
    });
  });

  test("works with input theme object of scalars", () => {
    expect(
      themeScalarValueToResponsiveValue({ "@b1": 10, "@b5": 20 }, devices)
    ).toEqual({ $res: true, b1: 10, b5: 20 });
    expect(
      themeScalarValueToResponsiveValue({ "@b1": "xxx", "@b3": "yyy" }, devices)
    ).toEqual({ $res: true, b1: "xxx", b3: "yyy" });
    expect(
      themeScalarValueToResponsiveValue(
        { "@b1": { a: 10 }, "@b3": { b: 20 } },
        devices
      )
    ).toEqual({ $res: true, b1: { a: 10 }, b3: { b: 20 } });
  });

  test("trims non-breakpoint values", () => {
    const result = themeScalarValueToResponsiveValue<number>(
      { "@b1": 10, "@b5": 20, xxx: 30 },
      devices
    ) as TrulyResponsiveValue<number>;

    expect(result).toEqual({ $res: true, b1: 10, b5: 20 });

    expect(result.xxx).toBeUndefined();
  });

  test("properly interprets @initial", () => {
    expect(
      themeScalarValueToResponsiveValue(
        { "@b1": 10, "@b4": 20, "@initial": 30 },
        devices
      )
    ).toEqual({ $res: true, b1: 10, b4: 20, b5: 30 });
  });

  test("properly works with 0 value", () => {
    expect(
      themeScalarValueToResponsiveValue({ "@b1": 0, "@b4": 20 }, devices)
    ).toEqual({ $res: true, b1: 0, b4: 20 });
  });
});

describe("themeObjectToResponsiveValue", () => {
  test("just non-breakpoint values are transferred to highest breakpoint", () => {
    expect(
      themeObjectValueToResponsiveValue(
        { fontSize: 15, fontFamily: "Helvetica" },
        devices
      )
    ).toEqual({ $res: true, b5: { fontSize: 15, fontFamily: "Helvetica" } });
  });

  test("just breakpoint values work correctly (bigger breakpoints values are added to smaller breakpoint values)", () => {
    const result = themeObjectValueToResponsiveValue(
      {
        "@b1": { fontSize: 10 },
        "@b4": { fontSize: 15, fontFamily: "Helvetica" },
      },
      devices
    );

    expect(result).toEqual({
      $res: true,
      b1: {
        fontSize: 10,
        fontFamily: "Helvetica",
      },
      b4: {
        fontSize: 15,
        fontFamily: "Helvetica",
      },
    });
  });

  test("wrong breakpoints are trimmed)", () => {
    const result = themeObjectValueToResponsiveValue(
      {
        "@b1": { fontSize: 10 },
        "@b4": { fontSize: 15, fontFamily: "Helvetica" },
        "@xxx": { fontSize: 20 },
        "@yyy": { fontSize: 21 },
      },
      devices
    );

    expect(result).toEqual({
      $res: true,
      b1: {
        fontSize: 10,
        fontFamily: "Helvetica",
      },
      b4: {
        fontSize: 15,
        fontFamily: "Helvetica",
      },
    });
  });

  test("default values works correctly with breakpoint values", () => {
    const result = themeObjectValueToResponsiveValue(
      {
        "@b1": { fontSize: 10 },
        "@b4": { fontSize: 15 },
        fontFamily: "Helvetica",
        fontSize: 20,
      },
      devices
    );

    expect(result).toEqual({
      $res: true,
      b1: {
        fontSize: 10,
        fontFamily: "Helvetica",
      },
      b4: {
        fontSize: 15,
        fontFamily: "Helvetica",
      },
      b5: {
        fontSize: 20,
        fontFamily: "Helvetica",
      },
    });
  });

  test("default values works correctly with breakpoint values", () => {
    const result = themeObjectValueToResponsiveValue(
      {
        "@b1": { fontSize: 10 },
        "@b4": { fontSize: 15 },
        fontFamily: "Helvetica",
        fontSize: 20,
      },
      devices
    );

    expect(result).toEqual({
      $res: true,
      b1: {
        fontSize: 10,
        fontFamily: "Helvetica",
      },
      b4: {
        fontSize: 15,
        fontFamily: "Helvetica",
      },
      b5: {
        fontSize: 20,
        fontFamily: "Helvetica",
      },
    });
  });

  test("@initial overwrites default values", () => {
    const result = themeObjectValueToResponsiveValue(
      {
        "@b1": { fontSize: 10 },
        "@b4": { fontSize: 15 },
        "@initial": {
          fontFamily: "Arial",
        },
        fontFamily: "Helvetica",
        fontSize: 20,
      },
      devices
    );

    expect(result).toEqual({
      $res: true,
      b1: {
        fontSize: 10,
        fontFamily: "Arial",
      },
      b4: {
        fontSize: 15,
        fontFamily: "Arial",
      },
      b5: {
        fontSize: 20,
        fontFamily: "Arial",
      },
    });
  });

  test("max breakpoint overwrites default values AND @initial", () => {
    const result = themeObjectValueToResponsiveValue(
      {
        "@b1": { fontSize: 10 },
        "@b4": { fontSize: 15 },
        "@b5": {
          fontFamily: "Times New Roman",
        },
        "@initial": {
          fontFamily: "Arial",
        },
        fontFamily: "Helvetica",
        fontSize: 20,
      },
      devices
    );

    expect(result).toEqual({
      $res: true,
      b1: {
        fontSize: 10,
        fontFamily: "Times New Roman",
      },
      b4: {
        fontSize: 15,
        fontFamily: "Times New Roman",
      },
      b5: {
        fontSize: 20,
        fontFamily: "Times New Roman",
      },
    });
  });
});

import { Devices, TrulyResponsiveValue } from "../types";
import { getDevicesWidths } from "../compiler/devices";
import { responsiveValueGetDefinedValue } from "./responsiveValueGetDefinedValue";

const devices: Devices = [
  {
    id: "xs",
    w: 375,
    h: 667,
    breakpoint: 420,
  },
  {
    id: "md",
    w: 768,
    h: 1024,
    breakpoint: 960,
  },
  {
    id: "lg",
    w: 1024,
    h: 768,
    breakpoint: 1200,
  },
  {
    id: "xl",
    w: 1366,
    h: 768,
    breakpoint: 1600,
  },
  {
    id: "xxl",
    w: 1920,
    h: 920,
    breakpoint: null,
  },
];

const deviceWidths = getDevicesWidths(devices);

describe("responsiveValueGetClosestDefinedValue", () => {
  test("properly returns non-array value", () => {
    expect(
      responsiveValueGetDefinedValue("s1", "xs", devices, deviceWidths)
    ).toBe("s1");
    expect(
      responsiveValueGetDefinedValue(10, "xxl", devices, deviceWidths)
    ).toBe(10);
    expect(
      responsiveValueGetDefinedValue(null, "xxl", devices, deviceWidths)
    ).toBe(null);
    expect(
      responsiveValueGetDefinedValue(undefined, "xxl", devices, deviceWidths)
    ).toBe(undefined);
    expect(
      responsiveValueGetDefinedValue([1, 2, 3], "md", devices, deviceWidths)
    ).toEqual([1, 2, 3]);
    expect(
      responsiveValueGetDefinedValue({ a: 1 }, "md", devices, deviceWidths)
    ).toEqual({ a: 1 });
  });

  test("properly returns value for array with values", () => {
    const val = {
      md: 10,
      xl: 20,
      $res: true,
    };

    expect(
      responsiveValueGetDefinedValue(val, "xs", devices, deviceWidths)
    ).toBe(10);
    expect(
      responsiveValueGetDefinedValue(val, "md", devices, deviceWidths)
    ).toBe(10);
    expect(
      responsiveValueGetDefinedValue(val, "lg", devices, deviceWidths)
    ).toBe(20);
    expect(
      responsiveValueGetDefinedValue(val, "xl", devices, deviceWidths)
    ).toBe(20);
    expect(
      responsiveValueGetDefinedValue(val, "xxl", devices, deviceWidths)
    ).toBe(20);
  });

  test("properly returns value for array with null values", () => {
    const val = {
      md: null,
      xl: 20,
      $res: true,
    };

    expect(
      responsiveValueGetDefinedValue(val, "xs", devices, deviceWidths)
    ).toBe(null);
    expect(
      responsiveValueGetDefinedValue(val, "md", devices, deviceWidths)
    ).toBe(null);
    expect(
      responsiveValueGetDefinedValue(val, "lg", devices, deviceWidths)
    ).toBe(20);
    expect(
      responsiveValueGetDefinedValue(val, "xl", devices, deviceWidths)
    ).toBe(20);
    expect(
      responsiveValueGetDefinedValue(val, "xxl", devices, deviceWidths)
    ).toBe(20);
  });

  test("properly returns value for array with undefined values", () => {
    const val = {
      md: undefined,
      xl: 20,
      $res: true,
    };

    expect(
      responsiveValueGetDefinedValue(val, "xs", devices, deviceWidths)
    ).toBe(20);
    expect(
      responsiveValueGetDefinedValue(val, "md", devices, deviceWidths)
    ).toBe(20);
    expect(
      responsiveValueGetDefinedValue(val, "lg", devices, deviceWidths)
    ).toBe(20);
    expect(
      responsiveValueGetDefinedValue(val, "xl", devices, deviceWidths)
    ).toBe(20);
    expect(
      responsiveValueGetDefinedValue(val, "xxl", devices, deviceWidths)
    ).toBe(20);
  });

  test("properly returns value for array with nulls + undefined values", () => {
    const val = {
      xs: undefined,
      lg: null,
      $res: true,
    };

    expect(
      responsiveValueGetDefinedValue(val, "xs", devices, deviceWidths)
    ).toBe(null);
    expect(
      responsiveValueGetDefinedValue(val, "md", devices, deviceWidths)
    ).toBe(null);
    expect(
      responsiveValueGetDefinedValue(val, "lg", devices, deviceWidths)
    ).toBe(null);
    expect(
      responsiveValueGetDefinedValue(val, "xl", devices, deviceWidths)
    ).toBe(null);
    expect(
      responsiveValueGetDefinedValue(val, "xxl", devices, deviceWidths)
    ).toBe(null);
  });

  test("properly returns value for boolean", () => {
    const val = {
      md: false,
      xl: true,
      $res: true,
    };

    expect(
      responsiveValueGetDefinedValue(val, "xs", devices, deviceWidths)
    ).toBe(false);
    expect(
      responsiveValueGetDefinedValue(val, "md", devices, deviceWidths)
    ).toBe(false);
    expect(
      responsiveValueGetDefinedValue(val, "lg", devices, deviceWidths)
    ).toBe(true);
    expect(
      responsiveValueGetDefinedValue(val, "xl", devices, deviceWidths)
    ).toBe(true);
    expect(
      responsiveValueGetDefinedValue(val, "xxl", devices, deviceWidths)
    ).toBe(true);
  });

  describe("with widths parameter", () => {
    test("works", () => {
      const val = {
        $res: true,
        lg: "big",
        xxl: "small",
      };

      const widths: TrulyResponsiveValue<number> = {
        $res: true,
        xs: 300,
        md: 350,
        lg: 1024,
        xl: 500,
        xxl: 400,
      };

      expect(responsiveValueGetDefinedValue(val, "xs", devices, widths)).toBe(
        "small"
      );
      expect(responsiveValueGetDefinedValue(val, "md", devices, widths)).toBe(
        "small"
      );
      expect(responsiveValueGetDefinedValue(val, "lg", devices, widths)).toBe(
        "big"
      );
      expect(responsiveValueGetDefinedValue(val, "xl", devices, widths)).toBe(
        "big"
      );
      expect(responsiveValueGetDefinedValue(val, "xxl", devices, widths)).toBe(
        "small"
      );
    });

    test("works", () => {
      const val = {
        $res: true,
        xs: "xs-val",
        xl: "xl-val",
      };

      const widths: TrulyResponsiveValue<number> = {
        $res: true,
        xs: 500,
        md: 400,
        lg: 300,
        xl: 200,
        xxl: 100,
      };

      expect(responsiveValueGetDefinedValue(val, "xs", devices, widths)).toBe(
        "xs-val"
      );
      expect(responsiveValueGetDefinedValue(val, "md", devices, widths)).toBe(
        "xs-val"
      );
      expect(responsiveValueGetDefinedValue(val, "lg", devices, widths)).toBe(
        "xs-val"
      );
      expect(responsiveValueGetDefinedValue(val, "xl", devices, widths)).toBe(
        "xl-val"
      );
      expect(responsiveValueGetDefinedValue(val, "xxl", devices, widths)).toBe(
        "xl-val"
      );
    });
  });
});

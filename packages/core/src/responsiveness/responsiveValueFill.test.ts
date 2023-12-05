import { Devices, TrulyResponsiveValue } from "@easyblocks/core";
import { getDevicesWidths } from "../compiler/devices";
import { responsiveValueFill } from "./responsiveValueFill";

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

const deviceWidths = getDevicesWidths(devices);

describe("device widths", () => {
  test("works for scalars", () => {
    expect(responsiveValueFill(0, devices, deviceWidths)).toBe(0);
    expect(responsiveValueFill(100, devices, deviceWidths)).toBe(100);
    expect(responsiveValueFill("xxx", devices, deviceWidths)).toBe("xxx");
  });

  test("works for single value", () => {
    expect(
      responsiveValueFill({ $res: true, b4: 0 }, devices, deviceWidths)
    ).toEqual({ $res: true, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0 });
    expect(
      responsiveValueFill({ $res: true, b1: 100 }, devices, deviceWidths)
    ).toEqual({ $res: true, b1: 100, b2: 100, b3: 100, b4: 100, b5: 100 });
    expect(
      responsiveValueFill({ $res: true, b5: "xxx" }, devices, deviceWidths)
    ).toEqual({
      $res: true,
      b1: "xxx",
      b2: "xxx",
      b3: "xxx",
      b4: "xxx",
      b5: "xxx",
    });
  });

  test("works for two values", () => {
    expect(
      responsiveValueFill({ $res: true, b2: 100, b4: 0 }, devices, deviceWidths)
    ).toEqual({ $res: true, b1: 100, b2: 100, b3: 0, b4: 0, b5: 0 });
    expect(
      responsiveValueFill(
        { $res: true, b1: "xxx", b3: "yyy" },
        devices,
        deviceWidths
      )
    ).toEqual({
      $res: true,
      b1: "xxx",
      b2: "yyy",
      b3: "yyy",
      b4: "yyy",
      b5: "yyy",
    });
    expect(
      responsiveValueFill(
        { $res: true, b4: "xxx", b5: "yyy" },
        devices,
        deviceWidths
      )
    ).toEqual({
      $res: true,
      b1: "xxx",
      b2: "xxx",
      b3: "xxx",
      b4: "xxx",
      b5: "yyy",
    });
  });
});

describe("irregular widths", () => {
  const widths: TrulyResponsiveValue<number> = {
    $res: true,
    b1: 100,
    b2: 100,
    b3: 400,
    b4: 300,
    b5: 350,
  };

  test("works for two values", () => {
    expect(
      responsiveValueFill({ $res: true, b3: 100, b5: 50 }, devices, widths)
    ).toEqual({ $res: true, b1: 50, b2: 50, b3: 100, b4: 50, b5: 50 });
    expect(
      responsiveValueFill(
        { $res: true, b3: "big", b4: "small" },
        devices,
        widths
      )
    ).toEqual({
      $res: true,
      b1: "small",
      b2: "small",
      b3: "big",
      b4: "small",
      b5: "big",
    });
  });
});

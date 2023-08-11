import { Devices } from "@easyblocks/core";
import { responsiveValueFlatten } from "./responsiveValueFlatten";

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

describe("responsiveValueFlatten", () => {
  test("works with scalars", () => {
    expect(responsiveValueFlatten(10, devices)).toBe(10);
    expect(responsiveValueFlatten("abc", devices)).toBe("abc");
    expect(responsiveValueFlatten(0, devices)).toBe(0);
  });

  test("works with non-nested responsive arrays", () => {
    expect(
      responsiveValueFlatten({ b1: 10, b5: 50, $res: true }, devices)
    ).toEqual({ b1: 10, b5: 50, $res: true });
    expect(
      responsiveValueFlatten({ b1: 10, b5: 0, $res: true }, devices)
    ).toEqual({ b1: 10, b5: 0, $res: true });
    expect(
      responsiveValueFlatten({ b1: "aaa", b3: "bbb", $res: true }, devices)
    ).toEqual({ b1: "aaa", b3: "bbb", $res: true });
    expect(responsiveValueFlatten({ b4: "bbb", $res: true }, devices)).toEqual({
      b4: "bbb",
      $res: true,
    });
  });

  test("ignores undefineds, nulls are values", () => {
    expect(
      responsiveValueFlatten(
        { b1: 10, b3: undefined, b5: null, $res: true },
        devices
      )
    ).toEqual({ b1: 10, b5: null, $res: true });
    expect(
      responsiveValueFlatten({ b1: undefined, b3: null, $res: true }, devices)
    ).toEqual({ b3: null, $res: true });
  });

  test("works with nested responsive arrays", () => {
    expect(
      responsiveValueFlatten(
        { b1: 10, b5: { $res: true, b1: 51, b3: 53, b5: 55 }, $res: true },
        devices
      )
    ).toEqual({ b1: 10, b3: 53, b5: 55, $res: true });
    expect(
      responsiveValueFlatten(
        {
          // @ts-ignore
          b3: { $res: true, b1: 51, b3: 53, b5: 55 },

          // @ts-ignore
          b5: { $res: true, b1: 11, b2: 12, b3: 13, b4: 14, b5: 15 },
          $res: true,
        },
        devices
      )
    ).toEqual({ b1: 51, b3: 53, b4: 14, b5: 15, $res: true });

    expect(
      responsiveValueFlatten(
        {
          b4: 100,
          b5: { $res: true, b1: 11, b2: 12, b3: 13, b4: 14, b5: 15 },
          $res: true,
        },
        devices
      )
    ).toEqual({ b4: 100, b5: 15, $res: true });

    expect(
      responsiveValueFlatten(
        {
          b2: 0,
          b4: { $res: true, b3: 100, b4: 200, b5: 300 },
          $res: true,
        },
        devices
      )
    ).toEqual({ b2: 0, b3: 100, b4: 200, b5: 300, $res: true });

    expect(
      responsiveValueFlatten(
        { $res: true, b4: { $res: true, b1: "white", b3: "red" } },
        devices
      )
    ).toEqual({
      b1: "white",
      b3: "red",
      b4: "red",
      $res: true,
    });
  });

  test("works with nested responsive arrays -> nested responsive value set for breakpoint for which the responsive value is null/undefined", () => {
    expect(
      responsiveValueFlatten(
        {
          b4: { $res: true, b1: 51, b3: 53, b5: 55 }, // b4 -> and b4 is not defined in the value. b5 should be taken
          b5: 100,
          $res: true,
        },
        devices
      )
    ).toEqual({ b1: 51, b3: 53, b4: 55, b5: 100, $res: true });
  });
});

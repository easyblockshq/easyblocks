import { Devices } from "@easyblocks/core";
import { responsiveValueDoesSatisfyCondition } from "./responsiveValueDoesSatisfyCondition";

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

describe("responsiveValueDoesSatisfyCondition", () => {
  test("works for scalar", () => {
    expect(
      responsiveValueDoesSatisfyCondition(10, (x) => x === 10, devices)
    ).toBe(true);
    expect(
      responsiveValueDoesSatisfyCondition(20, (x) => x === 10, devices)
    ).toBe(false);
  });

  test("works for responsive values", () => {
    expect(
      responsiveValueDoesSatisfyCondition(
        { $res: true, b1: 20, b4: 40 },
        (x) => x === 20,
        devices
      )
    ).toBe(false);
    expect(
      responsiveValueDoesSatisfyCondition(
        {
          $res: true,
          b1: 20,
          b4: 40,
        },
        (x) => typeof x === "number",
        devices
      )
    ).toBe(true);
  });

  test("nulls are values, undefineds ignored", () => {
    expect(
      responsiveValueDoesSatisfyCondition(
        {
          $res: true,
          b1: 20,
          b4: 40,
          b5: undefined,
        },
        (x) => typeof x === "number",
        devices
      )
    ).toBe(true);
    expect(
      responsiveValueDoesSatisfyCondition(
        {
          $res: true,
          b1: 20,
          b4: 40,
          b5: null,
        },
        (x) => typeof x === "number",
        devices
      )
    ).toBe(false);
    expect(
      responsiveValueDoesSatisfyCondition(
        {
          $res: true,
          b2: null,
          b4: null,
          b5: undefined,
        },
        (x) => x === null,
        devices
      )
    ).toBe(true);
  });

  test("recursion", () => {
    expect(
      responsiveValueDoesSatisfyCondition(
        {
          $res: true,
          b2: { $res: true, b1: 40 },
          b4: { $res: true, b2: 50 },
        },
        (x) => typeof x === "object",
        devices
      )
    ).toBe(true);
    expect(
      responsiveValueDoesSatisfyCondition(
        {
          $res: true,
          b2: { $res: true, b1: 40 },
          b4: { $res: true, b2: 50 },
        },
        (x) => typeof x === "number",
        devices
      )
    ).toBe(false);

    expect(
      responsiveValueDoesSatisfyCondition(
        {
          $res: true,
          b2: { $res: true, b1: 40 },
          b4: { $res: true, b2: 50 },
        },
        (x) => typeof x === "object",
        devices,
        true
      )
    ).toBe(false);
    expect(
      responsiveValueDoesSatisfyCondition(
        {
          $res: true,
          b2: { $res: true, b1: 40 },
          b4: { $res: true, b2: 50 },
        },
        (x) => typeof x === "number",
        devices,
        true
      )
    ).toBe(true);
  });
});

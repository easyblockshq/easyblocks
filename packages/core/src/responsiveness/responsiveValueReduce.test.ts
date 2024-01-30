import { Devices } from "../types";
import { responsiveValueReduce } from "./responsiveValueReduce";

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
      responsiveValueReduce(10, (prev, cur) => prev + cur, 0, devices)
    ).toBe(10);
    expect(
      responsiveValueReduce(10, (prev, cur) => prev + cur, 5, devices)
    ).toBe(15);

    expect(
      responsiveValueReduce("xxx", (prev, cur) => `${prev}${cur}`, "", devices)
    ).toBe("xxx");
    expect(
      responsiveValueReduce(
        "xxx",
        (prev, cur) => `${prev}${cur}`,
        "yyy",
        devices
      )
    ).toBe("yyyxxx");
  });

  test("works for responsive", () => {
    expect(
      responsiveValueReduce(
        {
          $res: true,
          b1: 10,
          b2: 20,
          b4: 50,
          xxx: 1111,
        },
        (prev, cur) => prev + cur,
        0,
        devices
      )
    ).toBe(80);

    expect(
      responsiveValueReduce(
        {
          $res: true,
          b1: "a",
          b4: "c",
          b2: "b",
          b3: undefined,
          xxx: "d",
        },
        (prev, cur) => `${prev}${cur}`,
        "...",
        devices
      )
    ).toBe("...abc");
  });
});

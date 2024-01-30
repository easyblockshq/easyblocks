import { Devices, ResponsiveValue } from "../types";
import { responsiveValueNormalize } from "./responsiveValueNormalize";

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

function testNormalize<T>(
  input: ResponsiveValue<T>,
  output: ResponsiveValue<T>
) {
  expect(responsiveValueNormalize(input, devices)).toEqual(output);
}

describe("normalizeResponsiveValue", () => {
  test("does nothing with non responsive values", () => {
    expect(responsiveValueNormalize("test", devices)).toEqual("test");
    expect(responsiveValueNormalize(10, devices)).toEqual(10);
    expect(responsiveValueNormalize([1, 2, 3], devices)).toEqual([1, 2, 3]);
    expect(responsiveValueNormalize({ a: 1, b: 2 }, devices)).toEqual({
      a: 1,
      b: 2,
    });
  });

  test("properly normalizes", () => {
    testNormalize(
      { b1: 10, b2: 20, b3: 20, b4: 20, b5: 20, $res: true },
      { b1: 10, b2: 20, $res: true }
    );

    testNormalize({ b1: 20, b2: 20, b3: 20, b4: 20, b5: 20, $res: true }, 20);

    testNormalize({ b3: 20, $res: true }, 20);

    testNormalize(
      { b2: 10, b5: 20, $res: true },
      { b2: 10, b3: 20, $res: true }
    );

    testNormalize(
      { b1: 10, b2: 10, b3: 20, b4: 20, b5: 30, $res: true },
      { b2: 10, b4: 20, b5: 30, $res: true }
    );
  });

  test("works well with null and undefined", () => {
    testNormalize(
      { b1: 10, b2: null, b3: null, b4: null, b5: null, $res: true },
      { b1: 10, b2: null, $res: true }
    );

    testNormalize(
      { b1: null, b2: null, b3: null, b4: null, b5: null, $res: true },
      null
    );

    testNormalize({ b3: 20, b4: undefined, $res: true }, 20);

    testNormalize(
      { b2: 10, b5: 20, b4: undefined, $res: true },
      { b2: 10, b3: 20, $res: true }
    );

    testNormalize(
      { b1: 10, b2: 10, b3: undefined, b4: null, b5: 30, $res: true },
      { b2: 10, b4: null, b5: 30, $res: true }
    );
  });

  test("works properly with arrays and objets", () => {
    const inputs = [[1, 2, 3], { a: 10 }];

    inputs.forEach((elem) => {
      testNormalize({ b1: elem, $res: true }, elem);

      testNormalize({ b1: elem, b4: elem, $res: true }, elem);

      testNormalize(
        { b1: null, b4: elem, $res: true },
        { b1: null, b2: elem, $res: true }
      );

      testNormalize(
        { b1: [1], b2: [1], b3: [1], b4: elem, b5: elem, $res: true },
        { b3: [1], b4: elem, $res: true }
      );
    });
  });
});

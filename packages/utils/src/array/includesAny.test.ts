import { includesAny } from "./includesAny";

describe("includesAny", () => {
  it.each`
    a                  | b                       | expectedResult
    ${["1"]}           | ${["1"]}                | ${true}
    ${[1, 2, 3]}       | ${[2, 3, 4]}            | ${true}
    ${["x", "y", "z"]} | ${["a", "b", "y", "c"]} | ${true}
  `(
    "Given $a and $b should return $expectedResult - some items intersect",
    ({ a, b, expectedResult }) => {
      expect(includesAny(a, b)).toEqual(expectedResult);
    }
  );

  it.each`
    a                  | b                  | expectedResult
    ${[]}              | ${[]}              | ${false}
    ${["1"]}           | ${["2"]}           | ${false}
    ${[1, 2, 3]}       | ${[4, 5]}          | ${false}
    ${["x", "y", "z"]} | ${["a", "b", "c"]} | ${false}
  `(
    "Given $a and $b should return $expectedResult - no items intersect",
    ({ a, b, expectedResult }) => {
      expect(includesAny(a, b)).toEqual(expectedResult);
    }
  );
});

import { preOrderPathComparator } from "./preOrderPathComparator";

describe("preOrderPathComparator", () => {
  describe("ascending", () => {
    test.each`
      a                  | b                  | expectedOutput
      ${"data.0"}        | ${"data.0"}        | ${0}
      ${"data.1"}        | ${"data.0"}        | ${1}
      ${"data.0"}        | ${"data.1"}        | ${-1}
      ${"data.0.item.9"} | ${"data.0.item.9"} | ${0}
      ${"data.1.item.9"} | ${"data.0.item.9"} | ${1}
      ${"data.0.item.9"} | ${"data.1.item.9"} | ${-1}
      ${"data.0.item.1"} | ${"data.0.item.0"} | ${1}
      ${"data.0.item.0"} | ${"data.0.item.1"} | ${-1}
      ${"data.3"}        | ${"data.0.item.0"} | ${1}
      ${"data.0.item.0"} | ${"data.2"}        | ${-1}
      ${"data.0"}        | ${"data.0.item.0"} | ${1}
      ${"data.0.item.0"} | ${"data.0"}        | ${-1}
    `(
      "given $a and $b to compare should return $expectedOutput ",
      ({ a, b, expectedOutput }) => {
        const actual = preOrderPathComparator()(a, b);
        expect(actual).toEqual(expectedOutput);
      }
    );
  });

  describe("descending", () => {
    test.each`
      a                  | b                  | expectedOutput
      ${"data.0"}        | ${"data.0"}        | ${-0}
      ${"data.1"}        | ${"data.0"}        | ${-1}
      ${"data.0"}        | ${"data.1"}        | ${1}
      ${"data.0.item.9"} | ${"data.0.item.9"} | ${-0}
      ${"data.1.item.9"} | ${"data.0.item.9"} | ${-1}
      ${"data.0.item.9"} | ${"data.1.item.9"} | ${1}
      ${"data.0.item.1"} | ${"data.0.item.0"} | ${-1}
      ${"data.0.item.0"} | ${"data.0.item.1"} | ${1}
      ${"data.3"}        | ${"data.0.item.0"} | ${-1}
      ${"data.0.item.0"} | ${"data.2"}        | ${1}
      ${"data.0"}        | ${"data.0.item.0"} | ${-1}
      ${"data.0.item.0"} | ${"data.0"}        | ${1}
    `(
      "given $a and $b to compare should return $expectedOutput",
      ({ a, b, expectedOutput }) => {
        const actual = preOrderPathComparator("descending")(a, b);
        expect(actual).toEqual(expectedOutput);
      }
    );
  });

  describe("incorect input", () => {
    test.each`
      a                      | b
      ${"notAPathToCompare"} | ${"data.0"}
      ${"data.0"}            | ${"anotherWrongPath"}
    `("given $a and $b to compare should throw error", ({ a, b }) => {
      expect(() => preOrderPathComparator()(a, b)).toThrowError(
        `Cannot compare paths '${a}' and '${b}'.`
      );
    });
  });
});

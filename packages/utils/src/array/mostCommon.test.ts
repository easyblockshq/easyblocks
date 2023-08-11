import { mostCommon } from "./mostCommon";

test("returns most common value from given array", () => {
  expect(mostCommon([1, 1, 2, 3, 4, 2, 1, 1])).toBe(1);
  expect(mostCommon(["black", "black", "red", "red", "red"])).toBe("red");
  expect(
    mostCommon([
      { fontFamily: "sans-serif", fontSize: 16 },
      { fontFamily: "Arial", fontSize: 24 },
      { fontFamily: "sans-serif", fontSize: 16 },
    ])
  ).toEqual({ fontFamily: "sans-serif", fontSize: 16 });
});

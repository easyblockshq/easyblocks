import { range } from "./range";

test.each([
  [1, 3, [1, 2, 3]],
  [0, 1, [0, 1]],
  [1, 5, [1, 2, 3, 4, 5]],
  [3, 3, [3]],
])("returns correct range", (rangeStart, rangeEnd, expectedRange) => {
  expect(range(rangeStart, rangeEnd)).toEqual(expectedRange);
});

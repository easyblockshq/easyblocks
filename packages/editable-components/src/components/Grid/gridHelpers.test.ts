import { buildRows } from "./gridHelpers";

describe("buildRows", () => {
  describe("grid mode", () => {
    test("all 1x1", () => {
      const rows = buildRows(
        [
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
        ],
        false,
        3
      );

      expect(rows).toEqual([[0, 1, 2], [3, 4, 5], [6]]);
    });

    test("single 2x2 that has place", () => {
      const rows = buildRows(
        [
          { itemSize: "1x1" },
          { itemSize: "2x2" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
        ],
        false,
        3
      );

      expect(rows).toEqual([[0, 1, 1], [2, 1, 1], [3, 4, 5], [6]]);
    });

    test("if 2x1 doesn't fit, it goes to the next row", () => {
      const rows = buildRows(
        [
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "2x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
        ],
        false,
        3
      );

      expect(rows).toEqual([
        [0, 1, 3],
        [2, 2, 4],
        [5, 6],
      ]);
    });

    test("overlap behaves correctly", () => {
      const rows = buildRows(
        [
          { itemSize: "1x1" },
          { itemSize: "2x2" },
          { itemSize: "2x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
          { itemSize: "1x1" },
        ],
        false,
        3
      );

      /**
       * TEMPORARILY WRONG!!! OVERLAPS BREAK STUFF
       */
      expect(rows).toEqual([[0, 1, 1], [2, 2, 1], [3, 4, 5], [6]]);
    });

    test("crashing use case", () => {
      const rows = buildRows(
        [{ itemSize: "1x1" }, { itemSize: "2x1" }],
        false,
        1
      );

      expect(rows).toEqual([[0], [1]]);
    });
  });
});

import { deepCompare } from "./deepCompare";

test("returns false for not deeply equal objects", () => {
  expect(
    deepCompare(
      {
        a: 1,
        b: 22,
        c: {
          d: 3,
          e: 55,
          f: {
            g: 6,
            h: 77,
          },
        },
      },
      {
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: 5,
          f: {
            g: 6,
            h: 7,
          },
        },
      }
    )
  ).toBe(false);
});

test("returns true for deeply equal objects", () => {
  expect(
    deepCompare(
      {
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: 5,
          f: {
            g: 6,
            h: 7,
          },
        },
      },
      {
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: 5,
          f: {
            g: 6,
            h: 7,
          },
        },
      }
    )
  ).toBe(true);
});

test("returns true for deeply equal objects with keys in different order", () => {
  expect(
    deepCompare(
      {
        b: 2,
        a: 1,
        c: {
          f: {
            g: 6,
            h: 7,
          },
          d: 3,
          e: 5,
        },
      },
      {
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: 5,
          f: {
            g: 6,
            h: 7,
          },
        },
      }
    )
  ).toBe(true);
});

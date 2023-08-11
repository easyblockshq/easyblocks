import { flattenResponsiveStyles } from "./flattenResponsiveStyles";

describe("flattenResponsiveStyles", () => {
  test("doesn't do anything with shallow structures", () => {
    const val = {
      test: 10,
      xxx: "xxx",
    };

    expect(flattenResponsiveStyles(val)).toEqual(val);
  });

  test("doesn't do anything with shallow structures + breakpoints on lowest level", () => {
    const val = {
      test: 10,
      xxx: "xxx",
      "@md": {
        yyy: "yyy",
      },
    };

    expect(flattenResponsiveStyles(val)).toEqual(val);
  });

  test("doesn't do anything with shallow structures + nested objects without breakpoints", () => {
    const val = {
      test: 10,
      xxx: "xxx",
      nested: {
        yyy: "yyy",
      },
    };

    expect(flattenResponsiveStyles(val)).toEqual(val);
  });

  test("nested breakpoints are moved to parent", () => {
    const val = {
      test: "val",
      "@md": {
        test: "val-md",
      },
      "@sm": {
        test: "val-sm",
      },
      nested: {
        test2: "xxx",
        "@sm": {
          test2: "yyy",
        },
        "@md": {
          test2: "zzz",
        },
        nested2: {
          test3: "test3",
          "@sm": {
            test3: "test3SM",
          },
          "@md": {
            test3: "test3MD",
          },
        },
      },
    };

    expect(flattenResponsiveStyles(val)).toEqual({
      test: "val",
      "@sm": {
        test: "val-sm",
        nested: {
          test2: "yyy",
          nested2: {
            test3: "test3SM",
          },
        },
      },
      "@md": {
        test: "val-md",
        nested: {
          test2: "zzz",
          nested2: {
            test3: "test3MD",
          },
        },
      },
      nested: {
        test2: "xxx",
        nested2: {
          test3: "test3",
        },
      },
    });
  });
});

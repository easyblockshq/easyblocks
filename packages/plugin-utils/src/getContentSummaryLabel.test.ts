import { getContentSummaryLabel } from "./getContentSummaryLabel";

test("it works for undefined", () => {
  expect(getContentSummaryLabel(undefined)).toEqual("Empty");
});

describe("it works for raw content with preview data", () => {
  test("mode content with one section", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
        preview: {
          mode: "content",
          sectionsCount: 1,
        },
      })
    ).toBe("1 section picked");
  });

  test("mode content with three sections", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
        preview: {
          mode: "content",
          sectionsCount: 3,
        },
      })
    ).toBe("3 sections picked");
  });

  test("mode grid with one extra card", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
        preview: {
          mode: "grid",
          extraCardsCount: 1,
        },
      })
    ).toEqual("Collection grid, number of extra cards: 1");
  });

  test("mode grid with three extra cards", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
        preview: {
          mode: "grid",
          extraCardsCount: 3,
        },
      })
    ).toEqual("Collection grid, number of extra cards: 3");
  });
});

describe("it works for raw content without preview data", () => {
  test("full content mode is content", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
        content: {
          _template: "$RootSections",
          data: [
            {
              Component: [
                {
                  _template: "$Card",
                },
              ],
            },
          ],
        },
      })
    ).toEqual("1 section picked");
  });

  test("full content mode is grid", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
        content: {
          _template: "$RootGrid",
          data: [
            {
              Component: [
                {
                  Cards: [
                    {
                      _template: "$Card",
                    },
                    {
                      _template: "$Card",
                    },
                    {
                      _template: "$Placeholder",
                    },
                  ],
                },
              ],
            },
          ],
        },
      })
    ).toEqual("Collection grid, number of extra cards: 2");
  });

  test("remote content", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
      })
    ).toBeUndefined();
  });
});

describe("it works for content piece", () => {
  test("full content mode is content", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
        config: {
          _template: "$RootSections",
          data: [
            {
              Component: [
                {
                  _template: "$Card",
                },
              ],
            },
          ],
        },
      })
    ).toBe("1 section picked");
  });

  test("full content mode is grid", () => {
    expect(
      getContentSummaryLabel({
        id: "1",
        hash: "2",
        config: {
          _template: "$RootGrid",
          data: [
            {
              Component: [
                {
                  Cards: [
                    {
                      _template: "$Card",
                    },
                    {
                      _template: "$Card",
                    },
                    {
                      _template: "$Placeholder",
                    },
                  ],
                },
              ],
            },
          ],
        },
      })
    ).toBe("Collection grid, number of extra cards: 2");
  });
});

describe("it works for config component", () => {
  test("full content mode is content and one section", () => {
    expect(
      getContentSummaryLabel({
        _template: "$RootSections",
        _id: "xxx",
        data: [
          {
            Component: [
              {
                _template: "$Card",
              },
            ],
          },
        ],
      })
    ).toBe("1 section picked");
  });

  test("full content mode is content and three sections", () => {
    expect(
      getContentSummaryLabel({
        _template: "$RootSections",
        _id: "xxx",
        data: [
          {
            Component: [
              {
                _template: "$Card",
              },
            ],
          },
          {
            Component: [
              {
                _template: "$Card",
              },
            ],
          },
          {
            Component: [
              {
                _template: "$Card",
              },
            ],
          },
        ],
      })
    ).toBe("3 sections picked");
  });

  test("full content mode is grid", () => {
    expect(
      getContentSummaryLabel({
        _template: "$RootGrid",
        _id: "xxx",
        data: [
          {
            Component: [
              {
                Cards: [
                  {
                    _template: "$Card",
                  },
                  {
                    _template: "$Card",
                  },
                  {
                    _template: "$Placeholder",
                  },
                ],
              },
            ],
          },
        ],
      })
    ).toBe("Collection grid, number of extra cards: 2");
  });
});

test("it throws an error for unknown content", () => {
  expect(() => getContentSummaryLabel("unknown content")).toThrowError(
    "Invalid content"
  );
});

test("it throws an error for unknown object content", () => {
  expect(() =>
    getContentSummaryLabel({
      foo: 1,
      bar: "baz",
    })
  ).toThrowError("Invalid content");
});

import { calculateAddButtonsProperties } from "./calculateAddButtonProperties";

const TEST_VIEWPORT = {
  width: 1366,
  height: 768,
};

const TEST_CONTAINER_RECT = createRect({
  top: 24,
  left: 24,
  right: 324,
  bottom: 324,
  width: 300,
  height: 300,
});

describe("vertical", () => {
  test("both buttons are visible when target element is within viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 24,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 10,
        left: 60,
        display: "block",
      },
      after: {
        top: 210,
        left: 60,
        display: "block",
      },
    });
  });

  test("both buttons are visible when target element is on the edges of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 0,
          left: 24,
          height: 768,
          width: 200,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: -14,
        left: 110,
        display: "block",
      },
      after: {
        top: 754,
        left: 110,
        display: "block",
      },
    });
  });

  test("before button is hidden when the start of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: -24,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: -38,
        left: 60,
        display: "none",
      },
      after: {
        top: 162,
        left: 60,
        display: "block",
      },
    });
  });

  test("after button is hidden when the end of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 720,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 706,
        left: 60,
        display: "block",
      },
      after: {
        top: 906,
        left: 60,
        display: "none",
      },
    });
  });

  test("both buttons are hidden when target element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: -224,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: -238,
        left: 60,
        display: "none",
      },
      after: {
        top: -38,
        left: 60,
        display: "none",
      },
    });
  });
});

describe("vertical within container", () => {
  test("both buttons are visible when target element is within container", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 48,
          left: 48,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 34,
        left: 84,
        display: "block",
      },
      after: {
        top: 234,
        left: 84,
        display: "block",
      },
    });
  });

  test("both buttons are visible when target element is on the edges of container", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 24,
          left: 24,
          height: 300,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 10,
        left: 60,
        display: "block",
      },
      after: {
        top: 310,
        left: 60,
        display: "block",
      },
    });
  });

  test("before button is hidden when the start of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: -140,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: -154,
        left: 60,
        display: "none",
      },
      after: {
        top: 46,
        left: 60,
        display: "block",
      },
    });
  });

  test("after button is hidden when the end of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 240,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 226,
        left: 60,
        display: "block",
      },
      after: {
        top: 426,
        left: 60,
        display: "none",
      },
    });
  });

  test("both buttons are hidden when target element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "vertical",
        createRect({
          top: 340,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 326,
        left: 60,
        display: "none",
      },
      after: {
        top: 526,
        left: 60,
        display: "none",
      },
    });
  });
});

describe("horizontal", () => {
  test("both buttons are visible when target element is within viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: 24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 110,
        left: 10,
        display: "block",
      },
      after: {
        top: 110,
        left: 110,
        display: "block",
      },
    });
  });

  test("both buttons are visible when target element is on the edges of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: 0,
          height: 300,
          width: 1366,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 160,
        left: -14,
        display: "block",
      },
      after: {
        top: 160,
        left: 1352,
        display: "block",
      },
    });
  });

  test("before button is hidden when the start of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: -24,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 110,
        left: -38,
        display: "none",
      },
      after: {
        top: 110,
        left: 62,
        display: "block",
      },
    });
  });

  test("after button is hidden when the end of element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: 1300,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 110,
        left: 1286,
        display: "block",
      },
      after: {
        top: 110,
        left: 1386,
        display: "none",
      },
    });
  });

  test("both buttons are hidden when target element is outside of viewport", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 24,
          left: -124,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT
      )
    ).toEqual({
      before: {
        top: 110,
        left: -138,
        display: "none",
      },
      after: {
        top: 110,
        left: -38,
        display: "none",
      },
    });
  });
});

describe("horizontal within container", () => {
  test("both buttons are visible when target element is within container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 48,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 134,
        left: 34,
        display: "block",
      },
      after: {
        top: 134,
        left: 134,
        display: "block",
      },
    });
  });

  test("both buttons are visible when target element is on the edges of container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 24,
          height: 200,
          width: 300,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 134,
        left: 10,
        display: "block",
      },
      after: {
        top: 134,
        left: 310,
        display: "block",
      },
    });
  });

  test("before button is hidden when the start of element is outside of container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 16,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 134,
        left: 2,
        display: "none",
      },
      after: {
        top: 134,
        left: 102,
        display: "block",
      },
    });
  });

  test("after button is hidden when the end of element is outside of container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 240,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 134,
        left: 226,
        display: "block",
      },
      after: {
        top: 134,
        left: 326,
        display: "none",
      },
    });
  });

  test("both buttons are hidden when target element is outside of container", () => {
    expect(
      calculateAddButtonsProperties(
        "horizontal",
        createRect({
          top: 48,
          left: 348,
          height: 200,
          width: 100,
        }),
        TEST_VIEWPORT,
        TEST_CONTAINER_RECT
      )
    ).toEqual({
      before: {
        top: 134,
        left: 334,
        display: "none",
      },
      after: {
        top: 134,
        left: 434,
        display: "none",
      },
    });
  });
});

function createRect(rect: Partial<DOMRect>): DOMRect {
  return {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
    ...rect,
  };
}

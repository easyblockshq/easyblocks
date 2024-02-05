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
        top: 13,
        left: 63,
        display: "block",
      },
      after: {
        top: 213,
        left: 63,
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
        top: -11,
        left: 113,
        display: "block",
      },
      after: {
        top: 757,
        left: 113,
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
        top: -35,
        left: 63,
        display: "none",
      },
      after: {
        top: 165,
        left: 63,
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
        top: 709,
        left: 63,
        display: "block",
      },
      after: {
        top: 909,
        left: 63,
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
        top: -235,
        left: 63,
        display: "none",
      },
      after: {
        top: -35,
        left: 63,
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
        top: 37,
        left: 87,
        display: "block",
      },
      after: {
        top: 237,
        left: 87,
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
        top: 13,
        left: 63,
        display: "block",
      },
      after: {
        top: 313,
        left: 63,
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
        top: -151,
        left: 63,
        display: "none",
      },
      after: {
        top: 49,
        left: 63,
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
        top: 229,
        left: 63,
        display: "block",
      },
      after: {
        top: 429,
        left: 63,
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
        top: 329,
        left: 63,
        display: "none",
      },
      after: {
        top: 529,
        left: 63,
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
        top: 113,
        left: 13,
        display: "block",
      },
      after: {
        top: 113,
        left: 113,
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
        top: 163,
        left: -11,
        display: "block",
      },
      after: {
        top: 163,
        left: 1355,
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
        top: 113,
        left: -35,
        display: "none",
      },
      after: {
        top: 113,
        left: 65,
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
        top: 113,
        left: 1289,
        display: "block",
      },
      after: {
        top: 113,
        left: 1389,
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
        top: 113,
        left: -135,
        display: "none",
      },
      after: {
        top: 113,
        left: -35,
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
        top: 137,
        left: 37,
        display: "block",
      },
      after: {
        top: 137,
        left: 137,
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
        top: 137,
        left: 13,
        display: "block",
      },
      after: {
        top: 137,
        left: 313,
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
        top: 137,
        left: 5,
        display: "none",
      },
      after: {
        top: 137,
        left: 105,
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
        top: 137,
        left: 229,
        display: "block",
      },
      after: {
        top: 137,
        left: 329,
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
        top: 137,
        left: 337,
        display: "none",
      },
      after: {
        top: 137,
        left: 437,
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

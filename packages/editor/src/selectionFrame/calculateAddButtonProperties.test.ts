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
        top: 12.5,
        left: 62.5,
        display: "block",
      },
      after: {
        top: 212.5,
        left: 62.5,
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
        top: -11.5,
        left: 112.5,
        display: "block",
      },
      after: {
        top: 756.5,
        left: 112.5,
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
        top: -35.5,
        left: 62.5,
        display: "none",
      },
      after: {
        top: 164.5,
        left: 62.5,
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
        top: 708.5,
        left: 62.5,
        display: "block",
      },
      after: {
        top: 908.5,
        left: 62.5,
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
        top: -235.5,
        left: 62.5,
        display: "none",
      },
      after: {
        top: -35.5,
        left: 62.5,
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
        top: 36.5,
        left: 86.5,
        display: "block",
      },
      after: {
        top: 236.5,
        left: 86.5,
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
        top: 12.5,
        left: 62.5,
        display: "block",
      },
      after: {
        top: 312.5,
        left: 62.5,
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
        top: -151.5,
        left: 62.5,
        display: "none",
      },
      after: {
        top: 48.5,
        left: 62.5,
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
        top: 228.5,
        left: 62.5,
        display: "block",
      },
      after: {
        top: 428.5,
        left: 62.5,
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
        top: 328.5,
        left: 62.5,
        display: "none",
      },
      after: {
        top: 528.5,
        left: 62.5,
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
        top: 112.5,
        left: 12.5,
        display: "block",
      },
      after: {
        top: 112.5,
        left: 112.5,
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
        top: 162.5,
        left: -11.5,
        display: "block",
      },
      after: {
        top: 162.5,
        left: 1354.5,
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
        top: 112.5,
        left: -35.5,
        display: "none",
      },
      after: {
        top: 112.5,
        left: 64.5,
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
        top: 112.5,
        left: 1288.5,
        display: "block",
      },
      after: {
        top: 112.5,
        left: 1388.5,
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
        top: 112.5,
        left: -135.5,
        display: "none",
      },
      after: {
        top: 112.5,
        left: -35.5,
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
        top: 136.5,
        left: 36.5,
        display: "block",
      },
      after: {
        top: 136.5,
        left: 136.5,
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
        top: 136.5,
        left: 12.5,
        display: "block",
      },
      after: {
        top: 136.5,
        left: 312.5,
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
        top: 136.5,
        left: 4.5,
        display: "none",
      },
      after: {
        top: 136.5,
        left: 104.5,
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
        top: 136.5,
        left: 228.5,
        display: "block",
      },
      after: {
        top: 136.5,
        left: 328.5,
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
        top: 136.5,
        left: 336.5,
        display: "none",
      },
      after: {
        top: 136.5,
        left: 436.5,
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

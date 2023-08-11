import type { EditingInfoBase } from "@easyblocks/core";
import { ADD_BUTTON_SIZE } from "./AddButton";

function calculateAddButtonsProperties(
  direction: Required<EditingInfoBase>["direction"],
  targetElementRect: DOMRect,
  viewport: {
    width: number;
    height: number;
  },
  containerElementRect?: DOMRect
): {
  before: { top: number; left: number; display: "block" | "none" };
  after: { top: number; left: number; display: "block" | "none" };
} {
  const halfButtonSize = ADD_BUTTON_SIZE / 2;

  if (direction === "vertical") {
    const beforeButtonTopOffset = targetElementRect.top - halfButtonSize;
    const afterButtonTopOffset =
      targetElementRect.top + targetElementRect.height - halfButtonSize;
    const buttonsLeftOffset =
      targetElementRect.left + targetElementRect.width / 2 - halfButtonSize;

    const isBeforeButtonWithinViewport = isButtonWithinViewport(
      {
        top: beforeButtonTopOffset + halfButtonSize,
        left: buttonsLeftOffset + halfButtonSize,
      },
      viewport
    );

    const isAfterButtonWithinViewport = isButtonWithinViewport(
      {
        top: afterButtonTopOffset + halfButtonSize,
        left: buttonsLeftOffset + halfButtonSize,
      },
      viewport
    );

    if (containerElementRect) {
      const isBeforeButtonWithinContainer = isButtonWithinContainer(
        {
          top: beforeButtonTopOffset + halfButtonSize,
          left: buttonsLeftOffset + halfButtonSize,
        },
        containerElementRect
      );

      const isAfterButtonWithinContainer = isButtonWithinContainer(
        {
          top: afterButtonTopOffset + halfButtonSize,
          left: buttonsLeftOffset + halfButtonSize,
        },
        containerElementRect
      );

      return {
        before: {
          top: beforeButtonTopOffset,
          left: buttonsLeftOffset,
          display:
            isBeforeButtonWithinViewport && isBeforeButtonWithinContainer
              ? "block"
              : "none",
        },
        after: {
          top: afterButtonTopOffset,
          left: buttonsLeftOffset,
          display:
            isAfterButtonWithinViewport && isAfterButtonWithinContainer
              ? "block"
              : "none",
        },
      };
    } else {
      return {
        before: {
          top: beforeButtonTopOffset,
          left: buttonsLeftOffset,
          display: isBeforeButtonWithinViewport ? "block" : "none",
        },
        after: {
          top: afterButtonTopOffset,
          left: buttonsLeftOffset,
          display: isAfterButtonWithinViewport ? "block" : "none",
        },
      };
    }
  } else {
    const buttonsTopOffset =
      targetElementRect.top + targetElementRect.height / 2 - halfButtonSize;
    const beforeButtonLeftOffset = targetElementRect.left - halfButtonSize;
    const afterButtonLeftOffset =
      targetElementRect.left + targetElementRect.width - halfButtonSize;

    const isBeforeButtonWithinViewport = isButtonWithinViewport(
      {
        top: buttonsTopOffset + halfButtonSize,
        left: beforeButtonLeftOffset + halfButtonSize,
      },
      viewport
    );
    const isAfterButtonWithinViewport = isButtonWithinViewport(
      {
        top: buttonsTopOffset + halfButtonSize,
        left: afterButtonLeftOffset + halfButtonSize,
      },
      viewport
    );

    if (containerElementRect) {
      const isBeforeButtonWithinContainer = isButtonWithinContainer(
        {
          top: buttonsTopOffset + halfButtonSize,
          left: beforeButtonLeftOffset + halfButtonSize,
        },
        containerElementRect
      );

      const isAfterButtonWithinContainer = isButtonWithinContainer(
        {
          top: buttonsTopOffset + halfButtonSize,
          left: afterButtonLeftOffset + halfButtonSize,
        },
        containerElementRect
      );

      return {
        before: {
          top: buttonsTopOffset,
          left: beforeButtonLeftOffset,
          display:
            isBeforeButtonWithinViewport && isBeforeButtonWithinContainer
              ? "block"
              : "none",
        },
        after: {
          top: buttonsTopOffset,
          left: afterButtonLeftOffset,
          display:
            isAfterButtonWithinViewport && isAfterButtonWithinContainer
              ? "block"
              : "none",
        },
      };
    } else {
      return {
        before: {
          top: buttonsTopOffset,
          left: beforeButtonLeftOffset,
          display: isBeforeButtonWithinViewport ? "block" : "none",
        },
        after: {
          top: buttonsTopOffset,
          left: afterButtonLeftOffset,
          display: isAfterButtonWithinViewport ? "block" : "none",
        },
      };
    }
  }
}

export { calculateAddButtonsProperties };

function isButtonWithinViewport(
  target: { top: number; left: number },
  viewport: { width: number; height: number }
) {
  return (
    target.top >= 0 &&
    target.top <= viewport.height &&
    target.left >= 0 &&
    target.left <= viewport.width
  );
}

function isButtonWithinContainer(
  target: { top: number; left: number },
  container: DOMRect
) {
  return (
    target.top >= container.top &&
    target.top <= container.bottom &&
    target.left >= container.left &&
    target.left <= container.right
  );
}

import type { useSortable } from "@dnd-kit/sortable";
import { selectionFramePositionChanged } from "@easyblocks/core/_internals";
import { Colors } from "@easyblocks/design-system";
import React, { MouseEvent, ReactNode, useEffect, useState } from "react";

type SelectionFrameControllerProps = {
  isActive: boolean;
  isChildrenSelectionDisabled: boolean;
  onSelect: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  sortable: ReturnType<typeof useSortable>;
  id: string;
  direction: "horizontal" | "vertical";
  path: string;
};

function SelectionFrameController({
  isActive,
  isChildrenSelectionDisabled,
  children,
  onSelect,
  sortable,
  id,
  direction,
  path,
}: SelectionFrameControllerProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useUpdateFramePosition({
    node,
    isDisabled: !isActive,
  });

  const isInsertingBefore = sortable.activeIndex > sortable.index;

  useEffect(() => {
    return () => {
      // If the the node of active element is not in the DOM anymore we want to deselect it to prevent showing
      // add buttons on the not existing element.
      if (
        isActive &&
        node &&
        !window.document.contains(node) &&
        path === window.parent.editorWindowAPI.editorContext.focussedField[0]
      ) {
        window.parent.editorWindowAPI.editorContext.setFocussedField([]);
      }
    };
  });

  const insertingClass = `${
    isInsertingBefore ? "insertingBefore" : "insertingAfter"
  }${direction === "horizontal" ? "Horizontal" : "Vertical"}`;

  return (
    <div
      data-active={isActive}
      data-children-selection-disabled={isChildrenSelectionDisabled}
      data-draggable-dragging={sortable.active !== null}
      data-draggable-over={sortable.isOver}
      data-draggable-active={
        sortable.active !== null && sortable.active?.id === id
      }
      className={`EasyblocksSelectionFrameController_Root EasyblocksSelectionFrameController_Root--${insertingClass}`}
      ref={(node) => {
        setNode(node);
        sortable.setNodeRef(node);
      }}
      onClick={onSelect}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      {children}
    </div>
  );
}

export { SelectionFrameController };

function useUpdateFramePosition({
  node,
  isDisabled,
}: {
  node: HTMLElement | null;
  isDisabled: boolean;
}) {
  const dispatch = window.parent.postMessage;

  useEffect(() => {
    if (isDisabled || !node) {
      return;
    }

    const updateSelectionFramePosition = createThrottledHandler(() => {
      const nodeRect = node.getBoundingClientRect();

      dispatch(
        selectionFramePositionChanged(
          nodeRect,
          window.document.documentElement.getBoundingClientRect()
        )
      );
    });

    window.addEventListener("scroll", updateSelectionFramePosition, {
      passive: true,
    });

    const handleResize = createThrottledHandler(() => {
      const nodeRect = node.getBoundingClientRect();
      dispatch(selectionFramePositionChanged(nodeRect));
    });

    window.addEventListener("resize", handleResize, {
      passive: true,
    });

    const updateSelectionFramePositionInScrollableContainer =
      createThrottledHandler((event) => {
        const nodeRect = node.getBoundingClientRect();
        const containerRect = (
          event.target as HTMLElement
        ).getBoundingClientRect();

        dispatch(selectionFramePositionChanged(nodeRect, containerRect));
      });

    const closestScrollableElement = node.closest(
      "[data-easyblocks-scrollable-root]"
    );

    closestScrollableElement?.addEventListener(
      "scroll",
      updateSelectionFramePositionInScrollableContainer,
      {
        passive: true,
      }
    );

    dispatch(
      selectionFramePositionChanged(
        node.getBoundingClientRect(),
        closestScrollableElement?.getBoundingClientRect()
      )
    );

    return () => {
      window.removeEventListener("scroll", updateSelectionFramePosition);
      window.removeEventListener("resize", handleResize);
      closestScrollableElement?.removeEventListener(
        "scroll",
        updateSelectionFramePositionInScrollableContainer
      );
    };
  });
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event#scroll_event_throttling
 */
function createThrottledHandler(callback: (event: Event) => void) {
  let isTicking = false;

  return (event: Event) => {
    if (isTicking) {
      return;
    }

    requestAnimationFrame(() => {
      callback(event);
      isTicking = false;
    });

    isTicking = true;
  };
}

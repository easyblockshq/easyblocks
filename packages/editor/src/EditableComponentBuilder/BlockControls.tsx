import { useDndContext } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  CompiledCustomComponentConfig,
  CompiledShopstoryComponentConfig,
  ComponentCollectionSchemaProp,
  SerializedRenderableComponentDefinition,
} from "@easyblocks/core";
import {
  parsePath,
  useEasyblocksCanvasContext,
  useEasyblocksMetadata,
} from "@easyblocks/core/_internals";
import { Colors } from "@easyblocks/design-system";
import { toArray } from "@easyblocks/utils";
import React, { Fragment } from "react";
import { SelectionFrameController } from "./SelectionFrameController";
import {
  RICH_TEXT_PART_CONFIG_PATH_REGEXP,
  isConfigPathRichTextPart,
} from "../utils/isConfigPathRichTextPart";

interface BlocksControlsProps {
  children: React.ReactNode;
  path: string;
  disabled?: boolean;
  direction: "horizontal" | "vertical";
  id: string;
  templateId: string;
  compiled: CompiledShopstoryComponentConfig | CompiledCustomComponentConfig;
  index: number;
  length: number;
}
export function BlocksControls({
  children,
  path,
  disabled,
  direction,
  id,
  index,
  length,
}: BlocksControlsProps) {
  const { focussedField, formValues } = useEasyblocksCanvasContext();

  if (!focussedField) {
    return;
  }

  const meta = useEasyblocksMetadata();
  const dndContext = useDndContext();

  const isActive = focussedField
    .map((focusedField) => {
      // If the focused field is rich text part path, we want to show the frame around rich text parent component.
      if (isConfigPathRichTextPart(focusedField)) {
        return focusedField.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "");
      }

      return focusedField;
    })
    .includes(path);

  const isChildComponentActive = focussedField.some((focusedField) =>
    focusedField.startsWith(path)
  );

  const entryPathParseResult = parsePath(path, { values: formValues });
  const entryComponentDefinition = meta.vars.definitions.components.find(
    (c) => c.id === entryPathParseResult.parent!.templateId
  );

  // component` could be draggable, but right now we only support collections.
  const isEntryComponentOrComponentFixed =
    entryComponentDefinition!.schema.some(
      (s) =>
        s.prop === entryPathParseResult.parent!.fieldName &&
        s.type === "component"
    );

  const isAncestorComponentActive = focussedField.some((f) =>
    entryPathParseResult.parent!.path.startsWith(f)
  );

  const isMultiSelection = focussedField.length > 1;

  const isSiblingComponentActive = focussedField.some((f) => {
    const pathWithoutIndexPart = path.split(".").slice(0, -1).join(".");
    const regexp = new RegExp(`^${pathWithoutIndexPart}\\.\\d+$`);
    return regexp.test(f);
  });

  const draggedEntryPathParseResult = dndContext.active
    ? parsePath(dndContext.active.data.current!.path, { values: formValues })
    : null;

  const draggedComponentDefinition = draggedEntryPathParseResult
    ? meta.vars.definitions.components.find(
        (c) => c.id === draggedEntryPathParseResult.templateId
      )
    : null;

  const canDraggedComponentBeDropped =
    entryComponentDefinition && draggedComponentDefinition
      ? getAllowedComponentTypes(entryComponentDefinition).some((type) => {
          return (
            toArray(draggedComponentDefinition.type ?? []).includes(type) ||
            draggedComponentDefinition.id === type
          );
        })
      : true;

  const isDroppableDisabled =
    disabled ||
    isEntryComponentOrComponentFixed ||
    !canDraggedComponentBeDropped;

  const sortable = useSortable({
    id,
    data: {
      path,
    },
    disabled: {
      draggable:
        disabled ||
        isMultiSelection ||
        isEntryComponentOrComponentFixed ||
        (!isActive &&
          !isAncestorComponentActive &&
          !isSiblingComponentActive &&
          !isChildComponentActive),
      droppable: isDroppableDisabled,
    },
    strategy:
      direction === "horizontal"
        ? horizontalListSortingStrategy
        : verticalListSortingStrategy,
  });

  if (disabled) {
    return <>{children}</>;
  }

  const focusOnBlock = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (isActive) {
      return;
    }

    const closestEditableElementFromTarget = (
      event.target as HTMLElement
    ).closest('[contenteditable="true"]');

    const isActiveElementContentEditable =
      document.activeElement?.getAttribute("contenteditable") === "true";

    // If target of event is within a content editable element we don't want to focus block.
    // If active element is a content editable element, we also don't want to focus block.
    // The latter is helpful when we start text selection within the content editable element
    // and end selection outside of anchor element.
    if (closestEditableElementFromTarget || isActiveElementContentEditable) {
      return;
    }

    const isMultipleSelection = event.shiftKey;

    function getNextFocusedField() {
      if (!focussedField) {
        return;
      }

      if (isMultipleSelection) {
        if (focussedField.includes(path)) {
          const result = focussedField.filter(
            (fieldName) => fieldName !== path
          );

          if (result.length > 0) {
            return result;
          }

          return [];
        }

        return [...focussedField, path];
      }

      return path;
    }

    const nextFocusedField = getNextFocusedField();

    window.parent.postMessage(
      {
        type: "@easyblocks-editor/focus-field",
        payload: {
          target: nextFocusedField,
        },
      },
      "*"
    );

    if (isMultipleSelection) {
      document.getSelection()?.removeAllRanges();
    }
  };

  const isActivePathInDifferentCollection =
    sortable.active &&
    !isPathsParentEqual(sortable.active.data.current!.path, path);

  return (
    <Fragment>
      {!isDroppableDisabled &&
        isActivePathInDifferentCollection &&
        sortable.activeIndex < sortable.index &&
        index === 0 && (
          <DroppablePlaceholder
            id={id}
            direction={direction}
            path={path}
            position="before"
          />
        )}

      <SelectionFrameController
        isActive={isActive}
        isChildrenSelectionDisabled={!isActive && !isChildComponentActive}
        onSelect={focusOnBlock}
        stitches={meta.stitches}
        sortable={sortable}
        id={id}
        direction={direction}
        path={path}
      >
        {children}
      </SelectionFrameController>

      {!isDroppableDisabled &&
        isActivePathInDifferentCollection &&
        sortable.activeIndex > sortable.index &&
        index === length - 1 && (
          <DroppablePlaceholder
            id={id}
            direction={direction}
            path={path}
            position="after"
          />
        )}
    </Fragment>
  );
}

function getAllowedComponentTypes(
  componentDefinition: SerializedRenderableComponentDefinition
) {
  const collectionSchemaProps =
    componentDefinition.schema.filter<ComponentCollectionSchemaProp>(
      (s): s is ComponentCollectionSchemaProp =>
        s.type === "component-collection"
    );

  const allowedComponentTypes = collectionSchemaProps.flatMap((s) => s.accepts);
  return Array.from(new Set(allowedComponentTypes));
}

function isPathsParentEqual(path1: string, path2: string) {
  const activePathParts = path1.split(".");
  const currentPathParts = path2.split(".");

  return (
    activePathParts.slice(0, -1).join(".") ===
    currentPathParts.slice(0, -1).join(".")
  );
}

function DroppablePlaceholder({
  id,
  direction,
  path,
  position,
}: {
  id: string;
  direction: string;
  path: string;
  position: "before" | "after";
}) {
  const meta = useEasyblocksMetadata();

  const sortable = useSortable({
    id: `${id}.${position}`,
    data: {
      path,
    },
    disabled: {
      draggable: true,
      droppable: false,
    },
  });

  const isInsertingBefore = sortable.activeIndex > sortable.index;

  const wrapperStyles = meta.stitches.css({
    position: "absolute",
    [position === "before" ? "top" : "bottom"]:
      direction === "vertical" ? "-100%" : 0,
    [position === "before" ? "left" : "right"]:
      direction === "horizontal" ? "-100%" : 0,
    height: "100%",
    background: "transparent",
    width: "100%",

    "&::before": {
      display: "block",
      content: "''",
      backgroundColor: Colors.blue50,
      zIndex: 9999999,
      position: "absolute",
      opacity: 0,
    },
    "&[data-draggable-over=true]::before": {
      opacity: 1,
      ...(direction === "horizontal"
        ? {
            top: 0,
            bottom: 0,
            [isInsertingBefore ? "left" : "right"]: "0px",
            height: "100%",
            width: "4px",
          }
        : {
            left: 0,
            right: 0,
            [isInsertingBefore ? "top" : "bottom"]: "0px",
            width: "100%",
            height: "4px",
          }),
    },
  });

  return (
    <div
      data-draggable-over={sortable.isOver}
      className={wrapperStyles().className}
      ref={sortable.setNodeRef}
      {...sortable.attributes}
      {...sortable.listeners}
    />
  );
}

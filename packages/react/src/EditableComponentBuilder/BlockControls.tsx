import { useDndContext } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  isConfigPathRichTextPart,
  parsePath,
  RICH_TEXT_PART_CONFIG_PATH_REGEXP,
} from "@easyblocks/app-utils";
import {
  CompiledCustomComponentConfig,
  CompiledShopstoryComponentConfig,
  ComponentCollectionSchemaProp,
  SerializedRenderableComponentDefinition,
} from "@easyblocks/core";
import { EditorContextType } from "@easyblocks/editor";
import { toArray } from "@easyblocks/utils";
import React from "react";
import { useEasyblocksMetadata } from "../EasyblocksMetadataProvider";
import { SelectionFrameController } from "./SelectionFrameController";

interface BlocksControlsProps {
  children: React.ReactNode;
  path: string;
  disabled?: boolean;
  direction: "horizontal" | "vertical";
  id: string;
  templateId: string;
  compiled: CompiledShopstoryComponentConfig | CompiledCustomComponentConfig;
}
export function BlocksControls({
  children,
  path,
  disabled,
  direction,
  id,
  compiled,
}: BlocksControlsProps) {
  const { focussedField, setFocussedField, form } = window.parent
    .editorWindowAPI.editorContext as EditorContextType;

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

  const entryPathParseResult = parsePath(path, form);
  const entryComponentDefinition = meta.vars.definitions.components.find(
    (c) => c.id === entryPathParseResult.parent!.templateId
  );

  // `component-fixed` can't be moved by design. `component` could be, but right now we only support collections.
  const isEntryComponentOrComponentFixed =
    entryComponentDefinition!.schema.some(
      (s) =>
        s.prop === entryPathParseResult.parent!.fieldName &&
        (s.type === "component" || s.type === "component-fixed")
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
    ? parsePath(dndContext.active.data.current!.path, form)
    : null;

  const draggedComponentDefinition = draggedEntryPathParseResult
    ? meta.vars.definitions.components.find(
        (c) => c.id === draggedEntryPathParseResult.templateId
      )
    : null;

  const canDraggedComponentBeDropped =
    entryComponentDefinition && draggedComponentDefinition
      ? getAllowedComponentTypes(entryComponentDefinition).some((type) => {
          return toArray(draggedComponentDefinition.type ?? []).includes(type);
        })
      : true;

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
      droppable:
        disabled ||
        isEntryComponentOrComponentFixed ||
        !canDraggedComponentBeDropped,
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

    setFocussedField(nextFocusedField);

    if (isMultipleSelection) {
      document.getSelection()?.removeAllRanges();
    }
  };

  return (
    <SelectionFrameController
      isActive={isActive}
      isChildrenSelectionDisabled={!isActive && !isChildComponentActive}
      onSelect={focusOnBlock}
      stitches={meta.easyblocksProviderContext.stitches}
      sortable={sortable}
      id={id}
      direction={direction}
    >
      {children}
    </SelectionFrameController>
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

  const allowedComponentTypes = collectionSchemaProps.flatMap(
    (s) => s.componentTypes
  );
  return Array.from(new Set(allowedComponentTypes));
}

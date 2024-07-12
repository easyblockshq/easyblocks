import {
  CollisionDetection,
  DndContext,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { NoCodeComponentEntry, Easyblocks, Renderer } from "@easyblocks/core";
import {
  EasyblocksMetadataProvider,
  EditorContextType,
  RichTextEditor,
  TextEditor,
  configTraverse,
  itemMoved,
} from "@easyblocks/core/_internals";
import { useForceRerender } from "@easyblocks/utils";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { CanvasRoot } from "./CanvasRoot/CanvasRoot";
import EditableComponentBuilder from "./EditableComponentBuilder/EditableComponentBuilder.editor";
import TypePlaceholder from "./Placeholder";
import { Colors, Fonts } from "@easyblocks/design-system";

const dragDataSchema = z.object({
  path: z.string(),
  sortable: z.object({
    index: z.number(),
  }),
});

function customCollisionDetection(args: Parameters<CollisionDetection>[0]) {
  // First, let's see if there are any collisions with the pointer
  const pointerCollisions = pointerWithin(args);

  // Collision detection algorithms return an array of collisions
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // If there are no collisions with the pointer, return rectangle intersections
  return rectIntersection(args);
}

// border: `1px dashed ${Colors.blue50}`,
// position: "relative",
// width: `${width ? `${width}px` : "auto"}`,
// height: "auto",
// transition: "all 0.1s",

function camelToDashed(camel: string) {
  return camel.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function stylesObjectToCSS(styles: Record<string, any>) {
  const arr: string[] = [];

  for (const key in styles) {
    arr.push(`${camelToDashed(key)}: ${styles[key]};`);
  }

  return arr.join("\n");
}

const easyblocksStyles = `

  /* vars */
  .EasyblocksFont_Body {
    ${stylesObjectToCSS(Fonts.body)}
  }

  /* InlineTextarea */

  .EasyblocksInlineTextarea_Textarea {
    width: 100%;
    word-wrap: break-word;
    display: block;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    box-sizing: border-box;
    color: inherit;
    letter-spacing: inherit;
    line-height: inherit;
    margin: 0 auto;
    max-width: inherit;
    text-transform: inherit;
    background-color: inherit;
    text-align: inherit;
    outline: none;
    resize: none;
    border: none;
    overflow: visible;
    position: relative;
    padding: 0;
    -ms-overflow-style: none;
    pointer-events: none;
  }

  .EasyblocksInlineTextarea_Textarea::-webkit-scrollbar {
    display: none;
  }

  .EasyblocksInlineTextarea_Textarea--enabled {
    pointer-events: auto;
  }

  /* RichText */

  .EasyblocksRichTextEditor_Root {
    cursor: inherit;
  }

  .EasyblocksRichTextEditor_Root--enabled {
    cursor: text;
  }

  .EasyblocksRichTextEditor_Root--fallbackValue {
    opacity: 0.5;
  }

  .EasyblocksRichTextEditor_Root [data-slate-node] {
    text-decoration: none;
  }

  .EasyblocksRichTextEditor_Root * {
    pointer-events: none;
    user-select: none;
  }

  .EasyblocksRichTextEditor_Root--enabled * {
    pointer-events: auto;
    user-select: auto;
  }

  .EasyblocksRichTextEditor_Root * {
    pointer-events: none;
    user-select: none;
  }

  .EasyblocksRichTextEditor_Root *::selection {
    background-color: #b4d5fe;
  }

  .EasyblocksRichTextEditor_Root--decorationActive *::selection {
    background-color: transparent;
  }

  .EasyblocksRichTextEditor_Root--decorationActive *[data-easyblocks-rich-text-selection] {
    background-color: #b4d5fe;
  }

  /* Placeholder */

  .EasyblocksPlaceholder_Root {
    border: 1px dashed ${Colors.blue50};
    position: relative;
    width: auto;
    height: auto;
    transition: all 0.1s;
  }

  .EasyblocksPlaceholder_Content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    color: ${Colors.blue50};
    justify-content: center;
    align-items: center;
    cursor: pointer;
    ${stylesObjectToCSS(Fonts.body)}
  }

  .EasyblocksPlaceholder_Content:hover {
    background-color: ${Colors.blue10};
  }

  .EasyblocksPlaceholder_Content[data-draggable-over=true] {
    background-color: ${Colors.blue10};
  }

  .EasyblocksPlaceholder_Content[data-draggable-dragging=true] {
    cursor: grabbing;
  }

  /* Droppable */
  
  .EasyblocksDroppablePlaceholder_Root {
    position: absolute;
    height: 100%;
    width: 100%;
    background: transparent;
  }

  .EasyblocksDroppablePlaceholder_Root--positionBeforeHorizontal {
    top: 0;
    left: -100%;
  }

  .EasyblocksDroppablePlaceholder_Root--positionAfterHorizontal {
    bottom: 0;
    right: -100%;
  }

  .EasyblocksDroppablePlaceholder_Root--positionBeforeVertical {
    top: -100%;
    left: 0;
  }

  .EasyblocksDroppablePlaceholder_Root--positionBeforeHorizontal {
    bottom: -100%;
    right: 0;
  }

  .EasyblocksDroppablePlaceholder_Root::before {
    display: block;
    content: '';
    background-color: ${Colors.blue50};
    z-index: 9999999;
    position: absolute;
    opacity: 0;
  }

  .EasyblocksDroppablePlaceholder_Root[data-draggable-over=true]::before {
    opacity: 1;
  }

  .EasyblocksDroppablePlaceholder_Root--insertingBeforeHorizontal[data-draggable-over=true]::before {
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 4px;
  }

  .EasyblocksDroppablePlaceholder_Root--insertingAfterHorizontal[data-draggable-over=true]::before {
    top: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 4px;
  }

  .EasyblocksDroppablePlaceholder_Root--insertingBeforeVertical[data-draggable-over=true]::before {
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 4px;
  }

  .EasyblocksDroppablePlaceholder_Root--insertingAfterVertical[data-draggable-over=true]::before {
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
  }

  /** SelectionFrameController */

  .EasyblocksSelectionFrameController_Root {
    position: relative;
    display: grid;
  }

  .EasyblocksSelectionFrameController_Root[data-children-selection-disabled=true] * {
    pointer-events: none !important;
    user-select: none !important;
  }

  .EasyblocksSelectionFrameController_Root[data-draggable-active=false]::after {
    content: '';
    box-sizing: border-box;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid var(--tina-color-primary);
    opacity: 0;
    pointer-events: none;
    user-select: none;
    transition: all 100ms;
    box-shadow: var(--tina-shadow-big);
    z-index: var(--tina-z-index-2);
  }

  .EasyblocksSelectionFrameController_Root[data-active=true]::after {
    opacity: 1;
  }

  .EasyblocksSelectionFrameController_Root:hover::after {
    opacity: 0.5;
  }

  .EasyblocksSelectionFrameController_Root[data-active=true]:hover::after {
    opacity: 1;
  }

  .EasyblocksSelectionFrameController_Root[data-draggable-active=true] {
    cursor: grabbing;
  }

  .EasyblocksSelectionFrameController_Root[data-draggable-over=true]::before {
    position: absolute;
    display: block;
    content: '';
    background-color: ${Colors.blue50};
    z-index: 9999999;
  }

  .EasyblocksSelectionFrameController_Root--insertingBeforeHorizontal[data-draggable-over=true]::before {
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 4px;
  }

  .EasyblocksSelectionFrameController_Root--insertingAfterHorizontal[data-draggable-over=true]::before {
    top: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: 4px;
  }

  .EasyblocksSelectionFrameController_Root--insertingBeforeVertical[data-draggable-over=true]::before {
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 4px;
  }

  .EasyblocksSelectionFrameController_Root--insertingAfterVertical[data-draggable-over=true]::before {
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 4px;
  }

`;

// position: "relative",
//     display: "grid",

//     "&[data-children-selection-disabled=true] *": {
//       pointerEvents: "none !important",
//       userSelect: "none !important",
//     },

//     "&[data-draggable-active=false]::after": {
//       content: `''`,
//       boxSizing: "border-box",
//       display: "block",
//       position: "absolute",
//       left: 0,
//       top: 0,
//       width: "100%",
//       height: "100%",
//       border: "1px solid var(--tina-color-primary)",
//       opacity: 0,
//       pointerEvents: "none",
//       userSelect: "none",
//       transition: "all 100ms",
//       boxShadow: "var(--tina-shadow-big)",
//       zIndex: "var(--tina-z-index-2)",
//     },

//     "&[data-active=true]::after": {
//       opacity: 1,
//     },

//     "&:hover::after": {
//       opacity: 0.5,
//     },

//     "&[data-active=true]:hover::after": {
//       opacity: 1,
//     },

//     "&[data-draggable-over=true]::before": {
//       position: "absolute",
//       ...(direction === "horizontal"
//         ? {
//             top: 0,
//             bottom: 0,
//             [isInsertingBefore ? "left" : "right"]: "0px",
//             height: "100%",
//             width: "4px",
//           }
//         : {
//             left: 0,
//             right: 0,
//             [isInsertingBefore ? "top" : "bottom"]: "0px",
//             width: "100%",
//             height: "4px",
//           }),

//       display: "block",
//       content: "''",
//       backgroundColor: "red",//Colors.blue50,
//       zIndex: 9999999,
//     },

//     "&[data-draggable-active=true]": {
//       opacity: 0.5,
//     },

//     "&[data-draggable-dragging=true]": {
//       cursor: "grabbing",
//     },

export function EasyblocksCanvas({
  components,
  renderer,
}: {
  components?: Record<string, React.ComponentType<any>>;
  renderer?: Renderer;
}) {
  const { meta, compiled, externalData, editorContext } =
    window.parent.editorWindowAPI;

  const [enabled, setEnabled] = useState(false);
  const activeDraggedEntryPath = useRef<string | null>(null);
  const { forceRerender } = useForceRerender();
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  useEffect(() => {
    if (window.self === window.top) {
      throw new Error("No host");
    } else {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    window.parent.editorWindowAPI.onUpdate = () => {
      // Force re-render when child gets info from parent that data changed
      forceRerender();
    };
  });

  const shouldNotRender = !enabled || !meta || !compiled || !externalData;

  if (shouldNotRender) {
    return <div>Loading...</div>;
  }

  const sortableItems = getSortableItems(
    editorContext.form.values,
    editorContext
  );

  return (
    /* EasyblocksMetadataProvider must be defined in case of nested <Easyblocks /> components are used! */
    <EasyblocksMetadataProvider meta={meta} renderer={renderer}>
      <style dangerouslySetInnerHTML={{ __html: easyblocksStyles }} />
      <CanvasRoot>
        <DndContext
          sensors={[mouseSensor]}
          collisionDetection={customCollisionDetection}
          onDragStart={(event) => {
            document.documentElement.style.cursor = "grabbing";
            activeDraggedEntryPath.current = dragDataSchema.parse(
              event.active.data.current
            ).path;
            window.parent.editorWindowAPI.editorContext.setFocussedField([]);
          }}
          onDragEnd={(event) => {
            document.documentElement.style.cursor = "";
            const activeData = dragDataSchema.parse(event.active.data.current);

            if (event.over) {
              const overData = dragDataSchema.parse(event.over.data.current);

              if (event.over.id === event.active.id) {
                // If the dragged item is dropped on itself, we want to refocus the dragged item.
                window.parent.editorWindowAPI.editorContext.setFocussedField(
                  activeData.path
                );
              } else {
                const itemMovedEvent = itemMoved({
                  fromPath: activeData.path,
                  toPath: overData.path,
                  placement: ifValidPlacement(
                    event.over.id.toString().split(".")[1]
                  ),
                });

                requestAnimationFrame(() => {
                  window.parent.postMessage(itemMovedEvent);
                });
              }
            } else {
              // If there was no drop target, we want to refocus the dragged item.
              window.parent.editorWindowAPI.editorContext.setFocussedField(
                activeData.path
              );
            }
          }}
          onDragCancel={(event) => {
            document.documentElement.style.cursor = "";
            // If the drag was canceled, we want to refocus dragged item.
            window.parent.editorWindowAPI.editorContext.setFocussedField(
              dragDataSchema.parse(event.active.data.current).path
            );
          }}
        >
          <SortableContext items={sortableItems}>
            <Easyblocks
              renderableDocument={{
                renderableContent: compiled,
                meta,
              }}
              externalData={externalData}
              components={{
                ...components,
                "@easyblocks/rich-text.editor": RichTextEditor,
                "@easyblocks/text.editor": TextEditor,
                "EditableComponentBuilder.editor": EditableComponentBuilder,
                Placeholder: TypePlaceholder,
              }}
            />
          </SortableContext>
        </DndContext>
      </CanvasRoot>
    </EasyblocksMetadataProvider>
  );
}

function getSortableItems(
  rootNoCodeEntry: NoCodeComponentEntry,
  editorContext: EditorContextType
) {
  const sortableItems: Array<string> = [];

  configTraverse(
    rootNoCodeEntry,
    editorContext,
    ({ value, schemaProp, config }) => {
      if (schemaProp.type === "component-collection") {
        if (value.length === 0) {
          sortableItems.push(`placeholder.${config._id}`);
          return;
        }

        sortableItems.push(`${value[0]._id}.before`);
        sortableItems.push(
          ...(value as Array<NoCodeComponentEntry>).map((v) => v._id)
        );
        sortableItems.push(`${value.at(-1)._id}.after`);
      }
    }
  );

  return sortableItems;
}
function ifValidPlacement(value: string): "before" | "after" | undefined {
  if (value === "before" || value === "after") {
    return value;
  }

  return;
}

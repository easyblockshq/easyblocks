import { DndContext, MouseSensor, useSensor } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import {
  configTraverse,
  EditorContextType,
  itemMoved,
} from "@easyblocks/app-utils";
import { ComponentConfig } from "@easyblocks/core";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import CanvasRoot from "./CanvasRoot/CanvasRoot";
import { Easyblocks } from "./Easyblocks";
import { EasyblocksMetadataProvider } from "./EasyblocksMetadataProvider";
import { useForceRerender } from "./hooks/useForceRerender";

const dragDataSchema = z.object({
  path: z.string(),
  sortable: z.object({
    index: z.number(),
  }),
});

export function EasyblocksCanvas() {
  const { meta, compiled, externalData, editorContext } =
    window.parent.editorWindowAPI;

  const [enabled, setEnabled] = useState(false);
  const { forceRerender } = useForceRerender();
  const activeDraggedEntryPath = useRef<string | null>(null);
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
    // EasyblocksMetadataProvider must be defined in case of nested <Easyblocks /> components are used!
    <EasyblocksMetadataProvider meta={meta}>
      <CanvasRoot>
        <DndContext
          sensors={[mouseSensor]}
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
              } else if (overData.sortable.index !== -1) {
                const itemMovedEvent = itemMoved({
                  fromPath: activeData.path,
                  toPath: overData.path ?? event.over.id.toString(),
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
            />
          </SortableContext>
        </DndContext>
      </CanvasRoot>
    </EasyblocksMetadataProvider>
  );
}

function getSortableItems(
  rootNoCodeEntry: ComponentConfig,
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

        sortableItems.push(
          ...(value as Array<ComponentConfig>).map((v) => v._id)
        );
      }
    }
  );

  return sortableItems;
}

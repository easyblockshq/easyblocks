import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { parsePath } from "@easyblocks/app-utils";
import { SSColors, SSFonts } from "@easyblocks/design-system";
import { EditorContextType } from "@easyblocks/editor";
import { toArray } from "@easyblocks/utils";
import React, { FC } from "react";
import { useEasyblocksMetadata } from "./EasyblocksMetadataProvider";

export type PlaceholderProps = {
  onClick: () => void;
  width?: number;
  height: number;
  autoWidth?: boolean;
  label: string;
  meta: any;
  sortable: ReturnType<typeof useSortable>;
};

function Placeholder(props: PlaceholderProps) {
  const {
    easyblocksProviderContext: { stitches },
  } = useEasyblocksMetadata();
  const styles: Record<string, any> = {};

  if (props.width) {
    const aspectRatio = props.height / props.width;
    styles.paddingBottom = `${aspectRatio * 100}%`;
  } else {
    styles.height = `${props.height}px`;
  }

  const rootClassName = stitches.css({
    border: `1px dashed ${SSColors.blue50}`,
    position: "relative",
    width: `${props.autoWidth ? "auto" : props.width + "px"}`,
    height: "auto",
    transition: "all 0.1s",
  });

  const contentClassName = stitches.css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    color: SSColors.blue50,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    ...SSFonts.body,
    "&:hover": {
      backgroundColor: SSColors.blue10,
    },
    "&[data-draggable-over=true]": {
      backgroundColor: SSColors.blue10,
    },
    "&[data-draggable-dragging=true]": {
      cursor: "grabbing",
    },
  });

  const content = (
    <div
      className={contentClassName()}
      onClick={(event) => {
        event.stopPropagation();
        props.onClick();
      }}
      data-draggable-over={props.sortable.isOver}
      data-draggable-dragging={props.sortable.active !== null}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 2V14M2 8H14" stroke={SSColors.blue50} />
      </svg>
      &nbsp;&nbsp;{props.label}
    </div>
  );

  return (
    <div
      className={rootClassName()}
      ref={props.sortable.setDroppableNodeRef}
      {...props.sortable.attributes}
      {...props.sortable.listeners}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          ...styles,
        }}
      ></div>
      {content}
    </div>
  );
}

type TypePlaceholderComponentBuilderProps = {
  id: string;
  path: string;
  type: string;
  onClick: () => void;
  meta: any;
};

type PlaceholderBuilderComponent = FC<TypePlaceholderComponentBuilderProps>;

export default function TypePlaceholder(
  props: TypePlaceholderComponentBuilderProps
) {
  const { form } = window.parent.editorWindowAPI
    .editorContext as EditorContextType;
  const meta = useEasyblocksMetadata();
  const dndContext = useDndContext();

  const draggedEntryPathParseResult = dndContext.active
    ? parsePath(dndContext.active.data.current!.path, form)
    : null;

  const draggedComponentDefinition = draggedEntryPathParseResult
    ? meta.vars.definitions.components.find(
        (c) => c.id === draggedEntryPathParseResult.templateId
      )
    : null;

  const canDraggedComponentBeDropped = draggedComponentDefinition
    ? toArray(draggedComponentDefinition.type ?? []).includes(props.type)
    : true;

  const sortable = useSortable({
    id: `placeholder.${props.id}`,
    data: {
      path: props.path,
    },
    disabled: {
      draggable: true,
      droppable: !canDraggedComponentBeDropped,
    },
  });

  const { type } = props;

  let placeholderWidth: number | undefined = undefined;
  let placeholderHeight: number;
  let placeholderLabel: string;
  let autoWidth = true;

  if (type === "section") {
    placeholderWidth = 1920;
    placeholderHeight = 600;
    placeholderLabel = "Add section";
  } else if (type === "card") {
    placeholderWidth = 420;
    placeholderHeight = 600;
    placeholderLabel = "Add card";
  } else if (type === "button") {
    placeholderWidth = 250;
    placeholderHeight = 50;
    placeholderLabel = "Add button";
    autoWidth = false;
  } else if (type === "item") {
    // placeholderWidth = 250;
    placeholderHeight = 50;
    placeholderLabel = "Add item";
  } else if (type === "image") {
    placeholderWidth = 250;
    placeholderHeight = 250;
    placeholderLabel = "Add image / video / solid color";
  } else if (type === "icon") {
    placeholderWidth = 50;
    placeholderHeight = 50;
    placeholderLabel = "Pick icon";
  } else {
    throw new Error("error, bad type: '" + type + "'");
  }

  return (
    <Placeholder
      width={placeholderWidth}
      height={placeholderHeight}
      autoWidth={autoWidth}
      label={placeholderLabel}
      onClick={props.onClick}
      meta={props.meta}
      sortable={sortable}
    />
  );
}

export type {
  TypePlaceholderComponentBuilderProps,
  PlaceholderBuilderComponent,
};

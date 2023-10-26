import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { parsePath } from "@easyblocks/app-utils";
import { SSColors, SSFonts } from "@easyblocks/design-system";
import { EditorContextType } from "@easyblocks/editor";
import { toArray } from "@easyblocks/utils";
import React, { FC } from "react";
import { useEasyblocksMetadata } from "./EasyblocksMetadataProvider";
import { PlaceholderAppearance } from "@easyblocks/core";

export type PlaceholderProps = {
  onClick: () => void;
  appearance: PlaceholderAppearance;
  meta: any;
  sortable: ReturnType<typeof useSortable>;
};

function Placeholder(props: PlaceholderProps) {
  const {
    easyblocksProviderContext: { stitches },
  } = useEasyblocksMetadata();
  const styles: Record<string, any> = {};

  const { aspectRatio, width, height, label } = props.appearance;

  if (height) {
    styles.height = `${height}px`;
  } else if (aspectRatio) {
    styles.paddingBottom = `${(1 / aspectRatio) * 100}%`;
  }

  const rootClassName = stitches.css({
    border: `1px dashed ${SSColors.blue50}`,
    position: "relative",
    width: `${width ? `${width}px` : "auto"}`,
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
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: SSColors.blue50 }}
      >
        <path
          d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
      {label && <span>&nbsp;&nbsp;{label}</span>}
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
  appearance?: PlaceholderAppearance;
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

  let appearance: PlaceholderAppearance;

  if (props.appearance) {
    appearance = props.appearance;
  } else {
    if (type === "section") {
      appearance = {
        label: "Add section",
        aspectRatio: 3.2,
      };
    } else if (type === "card") {
      appearance = {
        label: "Add card",
        aspectRatio: 0.7,
      };
    } else if (type === "button") {
      appearance = {
        label: "Add button",
        width: 250,
        height: 50,
      };
    } else if (type === "item") {
      appearance = {
        label: "Add item",
        // width: 250,
        height: 50,
      };
    } else if (type === "image") {
      appearance = {
        label: "Add image",
        aspectRatio: 1,
      };
    } else if (type === "icon") {
      appearance = {
        label: "Pick icon",
        width: 50,
        height: 50,
      };
    } else {
      appearance = {
        label: "Add",
        width: 50,
        aspectRatio: 1,
      };
    }
  }

  return (
    <Placeholder
      appearance={appearance}
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

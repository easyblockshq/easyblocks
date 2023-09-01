import {
  findComponentDefinitionById,
  isConfigPathRichTextPart,
  isSchemaPropCollection,
  parsePath,
  RICH_TEXT_PART_CONFIG_PATH_REGEXP,
  SelectionFramePositionChangedEvent,
} from "@easyblocks/app-utils";
import {
  CompiledShopstoryComponentConfig,
  EditingInfoBase,
} from "@easyblocks/core";
import { dotNotationGet } from "@easyblocks/utils";
import React, { useLayoutEffect } from "react";
import { pathToCompiledPath } from "../pathToCompiledPath";
import { EditorContextType, useEditorContext } from "../EditorContext";
import { AddButton } from "./AddButton";
import { calculateAddButtonsProperties } from "./calculateAddButtonProperties";
import {
  AFTER_ADD_BUTTON_DISPLAY,
  AFTER_ADD_BUTTON_LEFT,
  AFTER_ADD_BUTTON_TOP,
  BEFORE_ADD_BUTTON_DISPLAY,
  BEFORE_ADD_BUTTON_LEFT,
  BEFORE_ADD_BUTTON_TOP,
} from "./cssVariables";
import { FrameWrapper, Wrapper } from "./SelectionFrame.styles";

type SelectionFrameProps = {
  width: number;
  height: number;
  scaleFactor: number | undefined | null;
};

function SelectionFrame({ width, height, scaleFactor }: SelectionFrameProps) {
  const editorContext = useEditorContext();
  const { focussedField, form, actions } = editorContext;

  const normalizedScaleFactor = scaleFactor ?? 1;

  const compiledFocusedField =
    focussedField.length === 1
      ? pathToCompiledPath(focussedField[0], editorContext)
      : undefined;

  const compiledComponentConfig: CompiledShopstoryComponentConfig =
    compiledFocusedField
      ? dotNotationGet(
          editorContext.compiledComponentConfig,
          compiledFocusedField
        )
      : undefined;

  const { direction = "vertical" } = compiledComponentConfig?.__editing ?? {};

  const isAddingEnabled = isAddingEnabledForSelectedFields(
    focussedField,
    editorContext
  );

  useLayoutEffect(() => {
    if (focussedField.length === 0) {
      hideAddButtons();
    }
  }, [focussedField]);

  useLayoutEffect(() => {
    function handleSelectionFrameMessages(
      event: SelectionFramePositionChangedEvent
    ) {
      if (!isAddingEnabled) {
        hideAddButtons();
        return;
      }

      if (
        event.data.type === "@shopstory-editor/selection-frame-position-changed"
      ) {
        updateAddButtons(
          direction,
          event.data.payload.target,
          {
            width,
            height,
          },
          event.data.payload.container
        );
      }
    }

    window.addEventListener("message", handleSelectionFrameMessages);

    return () => {
      window.removeEventListener("message", handleSelectionFrameMessages);
    };
  }, [direction, height, isAddingEnabled, width]);

  async function handleAddButtonClick(which: "before" | "after") {
    let path = focussedField.length === 1 ? focussedField[0] : undefined;

    if (!path) {
      return;
    }

    if (isConfigPathRichTextPart(path)) {
      path = path.replace(RICH_TEXT_PART_CONFIG_PATH_REGEXP, "");
    }

    const { parent, index } = parsePath(path, form);

    if (!parent || index === undefined) {
      return;
    }

    const definition = findComponentDefinitionById(
      parent.templateId,
      editorContext
    );

    const schemaProp = definition?.schema.find(
      (schemaProp) => schemaProp.prop === parent.fieldName
    );

    if (!schemaProp) {
      return;
    }

    const parentPath =
      parent.path + (parent.path === "" ? "" : ".") + parent.fieldName;

    const config = await actions.openComponentPicker({ path: parentPath });

    if (config) {
      actions.insertItem({
        name:
          schemaProp.type === "component-collection-localised"
            ? `${parentPath}.${editorContext.contextParams.locale}`
            : parentPath,
        index: which === "before" ? index : index + 1,
        block: config,
      });
    }
  }

  return (
    <Wrapper>
      <FrameWrapper
        width={width}
        height={height}
        scaleFactor={normalizedScaleFactor}
      >
        <AddButton
          position="before"
          onClick={() => handleAddButtonClick("before")}
        />
        <AddButton
          position="after"
          onClick={() => handleAddButtonClick("after")}
        />
      </FrameWrapper>
    </Wrapper>
  );
}

export { SelectionFrame };

function updateAddButtons(
  direction: Required<EditingInfoBase>["direction"],
  targetElementRect: DOMRect,
  viewport: {
    width: number;
    height: number;
  },
  containerElementRect?: DOMRect
) {
  const { after, before } = calculateAddButtonsProperties(
    direction,
    targetElementRect,
    viewport,
    containerElementRect
  );

  setCssVariable(BEFORE_ADD_BUTTON_TOP, before.top + "px");
  setCssVariable(BEFORE_ADD_BUTTON_LEFT, before.left + "px");
  setCssVariable(AFTER_ADD_BUTTON_TOP, after.top + "px");
  setCssVariable(AFTER_ADD_BUTTON_LEFT, after.left + "px");
  setCssVariable(BEFORE_ADD_BUTTON_DISPLAY, before.display);
  setCssVariable(AFTER_ADD_BUTTON_DISPLAY, after.display);
}

function hideAddButtons() {
  setCssVariable(BEFORE_ADD_BUTTON_DISPLAY, "none");
  setCssVariable(AFTER_ADD_BUTTON_DISPLAY, "none");
}

function setCssVariable(name: string, value: number | string) {
  document.documentElement.style.setProperty(name, value.toString());
}

function isAddingEnabledForSelectedFields(
  focusedFields: Array<string>,
  editorContext: EditorContextType
) {
  if (focusedFields.length === 0) {
    return false;
  } else if (focusedFields.length === 1) {
    if (isConfigPathRichTextPart(focusedFields[0])) {
      return false;
    }

    const { parent } = parsePath(focusedFields[0], editorContext.form);

    if (!parent) return false;

    const parentDefinition = findComponentDefinitionById(
      parent.templateId,
      editorContext
    );

    const schemaProp = parentDefinition?.schema.find(
      (schemaProp) => schemaProp.prop === parent.fieldName
    );

    if (!schemaProp) return false;

    return isSchemaPropCollection(schemaProp);
  } else {
    return false;
  }
}

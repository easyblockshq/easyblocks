import { richTextChangedEvent } from "@easyblocks/app-utils";
import { ComponentSchemaProp, ConfigComponent, Field } from "@easyblocks/core";
import {
  findComponentDefinitionById,
  parsePath,
} from "@easyblocks/core/_internals";
import { SSButtonGhost, SSIcons, Typography } from "@easyblocks/design-system";
import { assertDefined, toArray } from "@easyblocks/utils";
import React, { useContext } from "react";
import type { FieldRenderProps } from "react-final-form";
import { css } from "styled-components";
import { useEditorContext } from "../../../EditorContext";
import { isMixedFieldValue } from "../components/isMixedFieldValue";
import { PanelContext } from "./BlockFieldPlugin";

interface IdentityFieldProps
  extends FieldRenderProps<ConfigComponent, HTMLElement> {
  field: Field;
}

function IdentityField({ input, field }: IdentityFieldProps) {
  const editorContext = useEditorContext();
  const panelContext = useContext(PanelContext);

  const isMixed = isMixedFieldValue(input.value);
  const config = isMixed ? null : input.value;

  if (config == null) {
    return null;
  }

  const componentDefinition = findComponentDefinitionById(
    config._template,
    editorContext
  );

  const configPaths = toArray(field.name);
  const { parent } = parsePath(configPaths[0], editorContext.form);
  const isWithinNestedPanel = panelContext !== undefined;

  const parentComponentDefinition = parent
    ? findComponentDefinitionById(parent.templateId, editorContext)
    : undefined;
  const parentSchemaProp = parentComponentDefinition?.schema.find(
    (schemaProp) => schemaProp.prop === parent!.fieldName
  );
  const rootComponentId =
    editorContext.activeRootContainer.defaultConfig._template;

  const isNonRemovable =
    (componentDefinition?.id.startsWith("@easyblocks/rich-text") &&
      componentDefinition.id !== "@easyblocks/rich-text") ||
    (parentSchemaProp
      ? parentSchemaProp.type === "component" &&
        (parentSchemaProp as ComponentSchemaProp).required
      : true);

  const isNonChangable =
    componentDefinition?.id === "@easyblocks/rich-text-part" ||
    componentDefinition?.id === rootComponentId;

  function handleChangeComponentType() {
    if (isNonChangable) {
      return;
    }

    if (!parent) {
      return;
    }

    const componentPickerPath = parent.path + "." + parent.fieldName;

    editorContext.actions
      .openComponentPicker({ path: componentPickerPath })
      .then((selectedConfig) => {
        if (!selectedConfig) {
          return;
        }

        editorContext.actions.replaceItems(configPaths, selectedConfig);
      });
  }

  function handleRemove() {
    if (isNonRemovable) {
      return;
    }

    const componentType = toArray(componentDefinition?.type ?? []);

    if (
      componentType.includes("action") &&
      parentComponentDefinition?.id ===
        "@easyblocks/rich-text-inline-wrapper-element"
    ) {
      // When component we're about to remove is an action and it's parent is a rich text inline wrapper element
      // we handle the removal by dispatching rich text changed event and let the rich text editor handle the removal
      const canvasIframe = document.getElementById(
        "shopstory-canvas"
      ) as HTMLIFrameElement | null;

      const actionProp = assertDefined(
        parentComponentDefinition.schema.find<ComponentSchemaProp>(
          (s): s is ComponentSchemaProp =>
            s.type === "component" &&
            (s as ComponentSchemaProp).accepts.includes("action")
        )
      );

      canvasIframe?.contentWindow?.postMessage(
        richTextChangedEvent({
          prop: actionProp.prop,
          schemaProp: actionProp,
          values: [[]],
        })
      );

      return;
    }

    editorContext.actions.removeItems(configPaths);
  }

  const titleContent = (
    <div
      css={css`
        display: flex;
        align-items: center;
        gap: 2px;
      `}
    >
      <Typography
        css={css`
          line-height: 14px;
          font-weight: 700;
        `}
      >
        {componentDefinition?.id === rootComponentId &&
        editorContext.activeRootContainer
          ? editorContext.activeRootContainer.label ??
            `${editorContext.activeRootContainer.id} document template`
          : componentDefinition?.label ?? componentDefinition?.id}
      </Typography>
      {!isNonChangable && <SSIcons.ChevronDown size={16} />}
    </div>
  );

  return (
    <div
      css={css`
        display: flex;
        gap: 8px;
        min-height: 28px;
        padding: 10px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          flex: 1 0;
        `}
      >
        {isWithinNestedPanel && (
          <SSButtonGhost
            icon={SSIcons.ChevronLeft}
            onClick={() => {
              panelContext.onClose();
            }}
            css={`
              margin-right: auto;
            `}
          />
        )}

        {isNonChangable && (
          <div style={{ padding: "7px 6px" }}>{titleContent}</div>
        )}
        {!isNonChangable && (
          <SSButtonGhost onClick={handleChangeComponentType}>
            {titleContent}
          </SSButtonGhost>
        )}

        <SSButtonGhost
          aria-label="Remove component"
          icon={SSIcons.Remove}
          onClick={handleRemove}
          css={css`
            margin-left: auto;
            opacity: ${isNonRemovable ? 0 : 1};
            pointer-events: ${isNonRemovable ? "none" : "auto"};
          `}
        />
      </div>
    </div>
  );
}

const IdentityFieldPlugin = {
  name: "identity",
  Component: IdentityField,
};

export { IdentityFieldPlugin };

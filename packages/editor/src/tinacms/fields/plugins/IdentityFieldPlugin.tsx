import {
  ComponentSchemaProp,
  Field,
  NoCodeComponentEntry,
} from "@easyblocks/core";
import {
  findComponentDefinitionById,
  parsePath,
} from "@easyblocks/core/_internals";
import { ButtonGhost, Icons, Typography } from "@easyblocks/design-system";
import { toArray } from "@easyblocks/utils";
import React, { useContext } from "react";
import type { FieldRenderProps } from "react-final-form";
import { css } from "styled-components";
import { useEditorContext } from "../../../EditorContext";
import { isMixedFieldValue } from "../components/isMixedFieldValue";
import { PanelContext } from "./BlockFieldPlugin";

interface IdentityFieldProps
  extends FieldRenderProps<NoCodeComponentEntry, HTMLElement> {
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
    config._component,
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

  const isNonRemovable =
    (componentDefinition?.id.startsWith("@easyblocks/rich-text") &&
      componentDefinition.id !== "@easyblocks/rich-text") ||
    (parentSchemaProp
      ? parentSchemaProp.type === "component" &&
        (parentSchemaProp as ComponentSchemaProp).required
      : true);

  const isNonChangable =
    componentDefinition?.id === "@easyblocks/rich-text-part" ||
    componentDefinition?.id === editorContext.rootComponent.id;

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
        {componentDefinition?.label ?? componentDefinition?.id}
      </Typography>
      {!isNonChangable && <Icons.ChevronDown size={16} />}
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
          <ButtonGhost
            icon={Icons.ChevronLeft}
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
          <ButtonGhost onClick={handleChangeComponentType}>
            {titleContent}
          </ButtonGhost>
        )}

        <ButtonGhost
          aria-label="Remove component"
          icon={Icons.Remove}
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

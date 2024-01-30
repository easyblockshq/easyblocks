import { NoCodeComponentEntry } from "@easyblocks/core";
import {
  findComponentDefinition,
  stripRichTextPartSelection,
} from "@easyblocks/core/_internals";
import {
  ButtonPrimary,
  ButtonSecondary,
  Colors,
  Fonts,
} from "@easyblocks/design-system";
import { dotNotationGet } from "@easyblocks/utils";
import * as React from "react";
import styled from "styled-components";
import { useEditorContext } from "./EditorContext";
import { pathToCompiledPath } from "./pathToCompiledPath";

const IdWrapper = styled.div`
  display: block;
  padding: 16px;
  ${Fonts.body}
  color: ${Colors.black40};
`;

export function SidebarFooter(props: { paths: string[] }) {
  const editorContext = useEditorContext();
  const { form, isAdminMode } = editorContext;

  if (props.paths.length === 0) {
    return null;
  }

  const path = stripRichTextPartSelection(props.paths[0]);
  const value: NoCodeComponentEntry = dotNotationGet(form.values, path);

  if (!value) {
    return null;
  }

  const compiledPath = pathToCompiledPath(path, editorContext);
  const compiledValue = dotNotationGet(
    editorContext.compiledComponentConfig,
    compiledPath
  );

  const widthInfo = compiledValue.__editing?.widthInfo;
  const width = widthInfo?.width?.xl;
  const widthAuto = widthInfo?.auto?.xl;

  const definition = findComponentDefinition(value, editorContext);
  const isSaveable = !!definition?.allowSave;

  const showSaveAsTemplate =
    isSaveable &&
    !editorContext.readOnly &&
    !editorContext.disableCustomTemplates;

  return (
    <div>
      <IdWrapper>
        <div>Id: {value._id}</div>
        <br />

        {showSaveAsTemplate && (
          <ButtonSecondary
            onClick={() => {
              editorContext.actions.openTemplateModal({
                mode: "create",
                config: value,
                width,
                widthAuto,
              });
            }}
          >
            Save as template
          </ButtonSecondary>
        )}

        {isAdminMode && (
          <div style={{ paddingTop: 16 }}>
            <div>
              <ButtonPrimary
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(value)).then(
                    () => {
                      console.log("copied!", value);
                    },
                    () => {
                      alert("Copy error");
                    }
                  );
                }}
              >
                Copy data
              </ButtonPrimary>
            </div>
            {value._master && (
              <div style={{ paddingTop: 16 }}>Master: {value._master}</div>
            )}
          </div>
        )}
      </IdWrapper>
    </div>
  );
}

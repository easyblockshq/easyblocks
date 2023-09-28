import {
  SSButtonPrimary,
  SSButtonSecondary,
  SSColors,
  SSFonts,
} from "@easyblocks/design-system";
import { dotNotationGet } from "@easyblocks/utils";
import * as React from "react";
import styled from "styled-components";
import { useEditorContext } from "./EditorContext";
import { ConfigComponent } from "@easyblocks/core";
import { findRoleFromSchemaProp } from "./findRole";
import { pathToCompiledPath } from "./pathToCompiledPath";
import { stripRichTextPartSelection } from "@easyblocks/app-utils";
import { parsePath } from "@easyblocks/app-utils";
import { findComponentDefinitionById } from "@easyblocks/app-utils";

const IdWrapper = styled.div`
  display: block;
  padding: 16px;
  ${SSFonts.body}
  color: ${SSColors.black40};
`;

export function SidebarFooter(props: { paths: string[] }) {
  const editorContext = useEditorContext();
  const { form, isMaster, isAdminMode } = editorContext;

  if (props.paths.length === 0) {
    return null;
  }

  const path = stripRichTextPartSelection(props.paths[0]);
  const value: ConfigComponent = dotNotationGet(form.values, path);

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

  const parentInfo = parsePath(path, form).parent!;

  const parentDefinition = findComponentDefinitionById(
    parentInfo.templateId,
    editorContext
  );
  const schema = parentDefinition!.schema.find(
    (schemaProp) => schemaProp.prop === parentInfo.fieldName
  )!;

  const role = findRoleFromSchemaProp(schema);

  const isSaveable =
    role !== undefined &&
    role !== "item" &&
    !role.startsWith("$"); /* rich text part, etc */

  const showSaveAsTemplate =
    isSaveable &&
    !editorContext.isPlayground &&
    !editorContext.disableCustomTemplates;

  return (
    <div>
      <IdWrapper>
        <div>Id: {value._id}</div>
        <br />

        {showSaveAsTemplate && (
          <SSButtonSecondary
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
          </SSButtonSecondary>
        )}

        {(isMaster || isAdminMode) && (
          <div style={{ paddingTop: 16 }}>
            <div>
              <SSButtonPrimary
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
              </SSButtonPrimary>
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

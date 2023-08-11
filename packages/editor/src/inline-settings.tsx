import { InternalField } from "@easyblocks/app-utils";
import React from "react";
import styled from "styled-components";
import { useEditorContext } from "./EditorContext";
import { SidebarFooter } from "./SidebarFooter";
import { FieldsBuilder } from "./tinacms/form-builder";
import { StyleReset } from "./tinacms/styles";

interface InlineSettingsProps {
  fields: InternalField[];
}

export function InlineSettings({ fields }: InlineSettingsProps) {
  const hasNoExtraFields = !(fields && fields.length);

  if (hasNoExtraFields) {
    return null;
  }

  return (
    <StyleReset
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ height: "100%" }}
    >
      {/* IMPORTANT: This stop propagation fixes issues with toggle unclicking */}
      <SettingsContent fields={fields} />
    </StyleReset>
  );
}
export interface SettingsContentProps {
  title?: string;
  fields: InternalField[];
}

function SettingsContent({ fields }: SettingsContentProps) {
  const { form, focussedField } = useEditorContext();

  return (
    <FormBody id={"sidebar-panels-root"}>
      <Wrapper>
        <FieldsBuilder form={form} fields={fields} />
        <SidebarFooter paths={focussedField} />
      </Wrapper>
    </FormBody>
  );
}

const FormBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-top: 1px solid var(--tina-color-grey-2);
  background-color: white;
`;

const Wrapper = styled.div`
  display: block;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

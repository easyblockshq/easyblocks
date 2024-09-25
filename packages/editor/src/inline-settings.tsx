import React, { MouseEvent, useCallback, memo } from "react";
import styled from "styled-components";

import type { InternalField } from "@easyblocks/core/_internals";

import { useEditorContext } from "./EditorContext";
import { SidebarFooter } from "./SidebarFooter";
import { FieldsBuilder } from "./tinacms/form-builder";
import { StyleReset } from "./tinacms/styles";

const resetStyle = { height: "100%" };

interface InlineSettingsProps {
  fields: InternalField[];
}

export const InlineSettings = memo(({ fields }: InlineSettingsProps) => {
  const hasNoExtraFields = !(fields && fields.length);

  const onClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (hasNoExtraFields) {
    return null;
  }

  return (
    <StyleReset onClick={onClick} style={resetStyle}>
      {/* IMPORTANT: This stop propagation fixes issues with toggle unclicking */}
      <SettingsContent fields={fields} />
    </StyleReset>
  );
});

interface SettingsContentProps {
  title?: string;
  fields: InternalField[];
}

function SettingsContent({ fields }: SettingsContentProps) {
  const { form, focussedField } = useEditorContext();

  return (
    <FormBody id="sidebar-panels-root">
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

import { InternalField } from "@easyblocks/core/_internals";
import { SSToggle } from "@easyblocks/design-system";
import React, { FC } from "react";
import styled from "styled-components";

export interface ToggleProps {
  name: string;
  input: any;
  field: ToggleFieldDefinition;
  disabled?: boolean;
  onBlur: <T>(event?: React.FocusEvent<T>) => void;
  onChange: <T>(event: React.ChangeEvent<T> | any) => void;
  onFocus: <T>(event?: React.FocusEvent<T>) => void;
}

interface ToggleFieldDefinition extends InternalField {
  component: "toggle";
  toggleLabels?: boolean | FieldLabels;
}

type FieldLabels = { true: string; false: string };

export const Toggle: FC<ToggleProps> = ({
  input,
  field,
  name,
  disabled = false,
}) => {
  const checked = !!(input.value || input.checked);

  const toggleProps = {
    ...input,
    labels: null,
    name: field.name,
    disabled,
    value: checked,
    checked,
  };
  return (
    <ToggleFieldWrapper>
      <SSToggle {...toggleProps} />
    </ToggleFieldWrapper>
  );
};

const ToggleFieldWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

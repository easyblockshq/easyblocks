"use client";
import { dotNotationGet } from "@easyblocks/utils";
import React, { ReactElement } from "react";
import { InternalNoCodeComponentProps } from "../../../components/ComponentBuilder/ComponentBuilder";
import { InlineTextarea } from "./InlineTextarea";

type TextProps = {
  value: string | undefined;
  Text: ReactElement;
} & InternalNoCodeComponentProps;

function TextEditor(props: TextProps) {
  const {
    Text,
    value,
    __easyblocks: { path, runtime },
  } = props;

  const { form } = (window as any).editorWindowAPI.editorContext;
  const valuePath = `${path}.value`;
  const configValue = dotNotationGet(form.values, valuePath);
  const isLocalTextReference = configValue.id?.startsWith("local.");

  return (
    <Text.type {...Text.props} as={"div"}>
      {isLocalTextReference ? (
        <InlineTextarea
          path={path}
          placeholder={"Here goes text content"}
          stitches={runtime.stitches}
        />
      ) : (
        value ?? <span>&nbsp;</span>
      )}
    </Text.type>
  );
}

export { TextEditor };

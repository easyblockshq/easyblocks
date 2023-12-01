"use client";
import { dotNotationGet } from "@easyblocks/utils";
import React, { ReactElement } from "react";
import { InlineTextarea } from "./InlineTextarea";

type TextProps = {
  value: string | undefined;
  runtime: any;
  path: string;
  Text: ReactElement;
};

function TextEditor(props: TextProps) {
  const { Text, path, value, runtime } = props;

  const { form } = (window.parent as any).editorWindowAPI.editorContext;
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

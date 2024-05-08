"use client";
import { dotNotationGet } from "@easyblocks/utils";
import React, { ReactElement } from "react";
import { InternalNoCodeComponentProps } from "../../../components/ComponentBuilder/ComponentBuilder";
import { InlineTextarea } from "./InlineTextarea";
import { useEasyblocksCanvasContext } from "../../../_internals";

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

  const canvasContext = useEasyblocksCanvasContext();

  if (!canvasContext) {
    return null;
  }
  const { formValues } = canvasContext;

  const valuePath = `${path}.value`;
  const configValue = dotNotationGet(formValues, valuePath);
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

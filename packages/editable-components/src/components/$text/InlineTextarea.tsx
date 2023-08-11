import { dotNotationGet } from "@easyblocks/utils";
import React, { useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { CompiledShopstoryComponentProps } from "../../types";
import { useTextValue } from "./useTextValue";

export interface InlineTextProps {
  path: string;
  placeholder?: string;
  stitches: CompiledShopstoryComponentProps["__fromEditor"]["runtime"]["stitches"];
}

export function InlineTextarea({
  path,
  placeholder,
  stitches,
}: InlineTextProps) {
  const { form } = window.parent.editorWindowAPI.editorContext;
  const valuePath = `${path}.value`;
  const value = dotNotationGet(form.values, valuePath);

  const inputProps = useTextValue(
    value,
    (val: string | null) => {
      form.change(valuePath, val);
    },
    placeholder
  );

  const css = useRef(
    stitches.css({
      width: "100%",
      wordWrap: "break-word",
      display: "block",
      fontSize: "inherit",
      fontFamily: "inherit",
      fontWeight: "inherit",
      boxSizing: "border-box",
      color: "inherit",
      letterSpacing: "inherit",
      lineHeight: "inherit",
      margin: "0 auto",
      maxWidth: "inherit",
      textTransform: "inherit",
      backgroundColor: "inherit",
      textAlign: "inherit",
      outline: "none",
      resize: "none",
      border: "none",
      overflow: "visible",
      position: "relative",
      padding: 0,
      "-ms-overflow-style": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    })()
  );

  return <TextareaAutosize className={css.current} rows={1} {...inputProps} />;
}

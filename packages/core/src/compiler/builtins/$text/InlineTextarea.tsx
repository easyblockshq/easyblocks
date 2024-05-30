import { dotNotationGet } from "@easyblocks/utils";
import React, { ElementRef, useRef, useState } from "react";
import { flushSync } from "react-dom";
import TextareaAutosize from "react-textarea-autosize";
import { useTextValue } from "../useTextValue";
import { useEasyblocksCanvasContext } from "../../../_internals";

interface InlineTextProps {
  path: string;
  placeholder?: string;
  stitches: any;
}

export function InlineTextarea({
  path,
  placeholder,
  stitches,
}: InlineTextProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const canvasContext = useEasyblocksCanvasContext();

  if (!canvasContext) {
    return null;
  }

  const { formValues, locale, locales } = canvasContext;

  const valuePath = `${path}.value`;
  const value = dotNotationGet(formValues, valuePath);

  const inputProps = useTextValue(
    value,
    (val: string | null) => {
      window.parent.postMessage(
        {
          type: "@easyblocks-editor/form-change",
          payload: {
            key: valuePath,
            value: val,
          },
        },
        "*"
      );
    },
    locale,
    locales,
    placeholder
  );

  const css = stitches.css({
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
    pointerEvents: isEnabled ? "auto" : "none",
  })();

  return (
    <div
      onMouseDown={(event) => {
        if (event.detail === 2) {
          event.preventDefault();

          flushSync(() => {
            setIsEnabled(true);
          });

          textAreaRef.current?.select();
        }
      }}
    >
      <TextareaAutosize
        className={css}
        rows={1}
        {...inputProps}
        ref={textAreaRef}
        onMouseDown={(event) => {
          if (isEnabled) {
            event.stopPropagation();
            return;
          }
        }}
        onBlur={() => {
          setIsEnabled(false);
        }}
      />
    </div>
  );
}

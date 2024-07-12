import { dotNotationGet } from "@easyblocks/utils";
import React, { ElementRef, useRef, useState } from "react";
import { flushSync } from "react-dom";
import TextareaAutosize from "react-textarea-autosize";
import { useTextValue } from "../useTextValue";

interface InlineTextProps {
  path: string;
  placeholder?: string;
}

export function InlineTextarea({ path, placeholder }: InlineTextProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const {
    form,
    contextParams: { locale },
    locales,
  } = (window.parent as any).editorWindowAPI.editorContext;
  const valuePath = `${path}.value`;
  const value = dotNotationGet(form.values, valuePath);

  const inputProps = useTextValue(
    value,
    (val: string | null) => {
      form.change(valuePath, val);
    },
    locale,
    locales,
    placeholder
  );

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
        className={`EasyblocksInlineTextarea_Textarea ${
          isEnabled ? "EasyblocksInlineTextarea_Textarea--enabled" : ""
        }`}
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

import type { TokenTypeWidgetComponentProps } from "@easyblocks/core";
import { Input } from "@easyblocks/design-system";
import React, { useState } from "react";

function SpaceTokenWidget(props: TokenTypeWidgetComponentProps<string>) {
  const [inputValue, setInputValue] = useState(props.value);

  return (
    <Input
      value={inputValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
      }}
      onBlur={() => {
        const int = Math.round(parseInt(inputValue));

        if (isNaN(int) || int < 0) {
          props.onChange("0px");
          return;
        }

        props.onChange(`${int}px`);
      }}
      align={"right"}
    />
  );
}

export { SpaceTokenWidget };

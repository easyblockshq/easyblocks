import { InlineTypeWidgetComponentProps } from "@easyblocks/core";
import { SSInput } from "@easyblocks/design-system";
import { useState } from "react";

function UrlWidget(props: InlineTypeWidgetComponentProps<string>) {
  const [value, setValue] = useState(props.value);

  return (
    <SSInput
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
      onBlur={() => {
        props.onChange(value);
      }}
    />
  );
}

export { UrlWidget };

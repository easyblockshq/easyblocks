import { useState } from "react";
import {
  SSSelectInline,
  SSToggleButton,
  Typography,
} from "@easyblocks/design-system";

export function ToggleButtonStories() {
  const [selected, setSelected] = useState(false);
  const [value, setValue] = useState("one");

  return (
    <div>
      <Typography variant={"label"}>ToggleButton</Typography>
      <br />
      <SSToggleButton
        onChange={(val) => {
          console.log("val", val);
          setSelected(val);
        }}
        selected={selected}
      >
        Click me
      </SSToggleButton>
      <br />
      <br />
      <SSSelectInline value={value} onChange={(newVal) => setValue(newVal)}>
        <SSToggleButton value={"one"}>One</SSToggleButton>
        <SSToggleButton value={"two"}>Two</SSToggleButton>
        <SSToggleButton value={"three"}>Three</SSToggleButton>
      </SSSelectInline>
    </div>
  );
}

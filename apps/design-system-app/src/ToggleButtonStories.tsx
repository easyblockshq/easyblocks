import { useState } from "react";
import {
  SelectInline,
  ToggleButton,
  Typography,
} from "@easyblocks/design-system";

export function ToggleButtonStories() {
  const [selected, setSelected] = useState(false);
  const [value, setValue] = useState("one");

  return (
    <div>
      <Typography variant={"label"}>ToggleButton</Typography>
      <br />
      <ToggleButton
        onChange={(val) => {
          console.log("val", val);
          setSelected(val);
        }}
        selected={selected}
      >
        Click me
      </ToggleButton>
      <br />
      <br />
      <SelectInline value={value} onChange={(newVal) => setValue(newVal)}>
        <ToggleButton value={"one"}>One</ToggleButton>
        <ToggleButton value={"two"}>Two</ToggleButton>
        <ToggleButton value={"three"}>Three</ToggleButton>
      </SelectInline>
    </div>
  );
}

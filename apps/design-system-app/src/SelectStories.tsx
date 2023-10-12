import { Select, SelectItem, Typography } from "@easyblocks/design-system";
import { useState } from "react";

export function SelectStories() {
  const [value, setValue] = useState("");

  return (
    <div>
      <Typography variant={"label"}>Select</Typography>
      <br />
      <Select value={value} onChange={setValue}>
        <SelectItem value={"one"}>Long SelectItem</SelectItem>
        <SelectItem value={"two"}>Two</SelectItem>
        <SelectItem value={"three"}>Three</SelectItem>
      </Select>
    </div>
  );
}

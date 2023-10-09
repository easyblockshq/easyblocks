import { SSSelect, Typography } from "@easyblocks/design-system";

export function SelectStories() {
  return (
    <div>
      <Typography variant={"label"}>Select</Typography>
      <br />
      <SSSelect>
        <option value={"one"}>Long option</option>
        <option value={"two"}>Two</option>
        <option value={"three"}>Three</option>
      </SSSelect>
    </div>
  );
}

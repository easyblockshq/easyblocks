import { SSToggle, Typography } from "@easyblocks/design-system";

export function ToggleStories() {
  return (
    <div>
      <Typography variant={"label"}>Toggle</Typography>
      <br />
      <SSToggle />
      <br />
      <Typography variant={"body"}>Forced checked</Typography>
      <br />
      <SSToggle checked={true} />
    </div>
  );
}

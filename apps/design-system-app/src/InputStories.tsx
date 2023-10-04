import { SSInput, Typography } from "@easyblocks/design-system";

export function InputStories() {
  return (
    <div>
      <Typography variant={"label"}>Input</Typography>
      <br />
      <SSInput
        placeholder={"Put some text here..."}
        name={"some-name"}
      ></SSInput>
      <br />
      <SSInput value={"Disabled input"} disabled={true}></SSInput>
    </div>
  );
}

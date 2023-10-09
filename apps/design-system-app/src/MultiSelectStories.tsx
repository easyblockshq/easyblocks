import {
  FormElement,
  MultiSelect,
  SSInput,
  Typography,
} from "@easyblocks/design-system";

export function MultiSelectStories() {
  return (
    <div>
      <Typography variant={"label"}>Multiselect</Typography>
      <br />

      <FormElement name={"Input"} label={"Text"}>
        <SSInput placeholder={"Input to compare"} withBorder={true} />
      </FormElement>
      <br />

      <FormElement name={"Multiselect"} label={"Multiselect"}>
        <MultiSelect />
      </FormElement>
    </div>
  );
}

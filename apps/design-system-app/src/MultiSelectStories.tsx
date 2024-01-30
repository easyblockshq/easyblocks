import {
  FormElement,
  MultiSelect,
  Input,
  Typography,
} from "@easyblocks/design-system";

export function MultiSelectStories() {
  return (
    <div>
      <Typography variant={"label"}>Multiselect</Typography>
      <br />

      <FormElement name={"Input"} label={"Text"}>
        <Input placeholder={"Input to compare"} withBorder={true} />
      </FormElement>
      <br />

      <FormElement name={"Multiselect"} label={"Multiselect"}>
        <MultiSelect />
      </FormElement>
    </div>
  );
}

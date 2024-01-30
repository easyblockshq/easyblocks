import {
  FormElement,
  Input,
  Toggle,
  Typography,
} from "@easyblocks/design-system";

export function FormStories() {
  return (
    <div>
      <Typography variant={"label"}>Forms</Typography>
      <br />
      <FormElement name={"test"} label={"Some field"}>
        <Input placeholder={"test"} withBorder={true} />
      </FormElement>
      <br />

      <FormElement
        name={"test2"}
        label={"Field with error"}
        error={"This is some error so that you know what is wrong."}
      >
        <Input placeholder={"test2"} withBorder={true} />
      </FormElement>
      <br />
      <FormElement name={"test-toggle"} label={"Toggle"}>
        <Toggle />
      </FormElement>

      {/*<FormElement name={"test2"} label={"This is a very long label so that we can check how it behaves"} >*/}
      {/*  <Input placeholder={"test2"} withBorder={true} />*/}
      {/*</FormElement>*/}
    </div>
  );
}

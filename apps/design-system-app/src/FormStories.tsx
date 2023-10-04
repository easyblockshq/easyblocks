import {
  FormElement,
  SSInput,
  SSToggle,
  Typography,
} from "@easyblocks/design-system";

export function FormStories() {
  return (
    <div>
      <Typography variant={"label"}>Forms</Typography>
      <br />
      <FormElement name={"test"} label={"Some field"}>
        <SSInput placeholder={"test"} withBorder={true} />
      </FormElement>
      <br />

      <FormElement
        name={"test2"}
        label={"Field with error"}
        error={"This is some error so that you know what is wrong."}
      >
        <SSInput placeholder={"test2"} withBorder={true} />
      </FormElement>
      <br />
      <FormElement name={"test-toggle"} label={"Toggle"}>
        <SSToggle />
      </FormElement>

      {/*<FormElement name={"test2"} label={"This is a very long label so that we can check how it behaves"} >*/}
      {/*  <SSInput placeholder={"test2"} withBorder={true} />*/}
      {/*</FormElement>*/}
    </div>
  );
}

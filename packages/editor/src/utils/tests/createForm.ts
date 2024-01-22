import { Form } from "../../form";

function createForm(initialValues: Record<string, any> = {}) {
  return new Form({
    id: "",
    label: "",
    onSubmit: () => {},
    initialValues,
  });
}

export { createForm };

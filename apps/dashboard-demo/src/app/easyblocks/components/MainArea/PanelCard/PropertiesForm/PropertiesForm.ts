import { NoCodeComponentDefinition } from "@easyblocks/core";

const propertiesFormDefinition: NoCodeComponentDefinition = {
  id: "PropertiesForm",
  label: "Properties Form",
  schema: [
    {
      prop: "Fields",
      type: "component-collection",
      accepts: ["PropertiesFormTextField", "PropertiesFormBooleanField"],
    },
    {
      prop: "Action",
      type: "component",
      accepts: ["formAction"],
      visible: true,
      noInline: true,
    },
    {
      prop: "Buttons",
      type: "component",
      required: true,
      accepts: ["ButtonsGroup"],
    },
  ],
  type: "item",
};

export { propertiesFormDefinition };

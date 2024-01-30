import { NoCodeComponentDefinition } from "@easyblocks/core";
import { createButtonDefinition } from "@/app/easyblocks/components/createButtonDefinition";

const buttonDefinition: NoCodeComponentDefinition = createButtonDefinition({
  id: "Button",
  label: "Button",
  type: "button",
  schema: [
    {
      prop: "variant",
      label: "Variant",
      type: "select",
      params: {
        options: ["solid", "soft", "outline", "ghost"],
      },
    },
    {
      prop: "size",
      label: "Size",
      type: "select",
      params: {
        options: ["1", "2", "3", "4"],
      },
      defaultValue: "2",
    },
    {
      prop: "label",
      label: "Label",
      type: "text",
    },
  ],
});

export { buttonDefinition };

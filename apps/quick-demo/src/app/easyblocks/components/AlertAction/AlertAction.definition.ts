import { NoCodeComponentDefinition } from "@easyblocks/core";

export const alertActionDefinition: NoCodeComponentDefinition = {
  id: "AlertAction",
  label: "Alert (demo)",
  type: "action",
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_action.png",
  schema: [
    {
      prop: "text",
      type: "string",
      defaultValue: "Lorem ipsum",
    },
  ],
};

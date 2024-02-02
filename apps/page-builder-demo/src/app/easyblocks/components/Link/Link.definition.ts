import { NoCodeComponentDefinition } from "@easyblocks/core";

/**
 * ProductCard is just for the demo purpose, it's not really styleable
 * It's only to show how external data can be connected to component
 */
export const linkDefinition: NoCodeComponentDefinition = {
  id: "Link",
  label: "Link",
  type: "action",
  thumbnail:
    "https://shopstory.s3.eu-central-1.amazonaws.com/picker_icon_link.png",
  schema: [
    {
      prop: "url",
      type: "url",
    },
    {
      prop: "shouldOpenInNewWindow",
      label: "Open in new window?",
      type: "boolean",
      defaultValue: true,
    },
  ],
};

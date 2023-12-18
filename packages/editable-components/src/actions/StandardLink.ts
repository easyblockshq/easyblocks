import { InternalLinkDefinition } from "@easyblocks/core/_internals";

const StandardLink: InternalLinkDefinition = {
  id: "$StandardLink",
  label: "Basic Link",
  schema: [
    {
      prop: "url",
      type: "text",
      defaultValue: "https://google.com",
    },
    {
      prop: "shouldOpenInNewWindow",
      label: "Open in new window?",
      type: "boolean",
    },
  ],
  type: "actionLink",
  icon: "link",
  preview: ({ values }) => {
    return {
      type: "icon",
      description: values.url ?? "None",
    };
  },
};

export { StandardLink };

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
  getEditorSidebarPreview: (config, _, options) => {
    if (!config.url) {
      return undefined;
    }

    return {
      type: "icon",
      description: config.url.value?.[options.contextParams.locale] ?? "None",
    };
  },
};

export { StandardLink };

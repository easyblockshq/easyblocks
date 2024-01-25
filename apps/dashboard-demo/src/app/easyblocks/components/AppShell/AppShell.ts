import { NoCodeComponentDefinition } from "@easyblocks/core";

const appShellDefinition: NoCodeComponentDefinition = {
  id: "AppShell",
  schema: [
    {
      prop: "Header",
      type: "component",
      required: true,
      accepts: ["AppShellHeader"],
    },
    {
      prop: "Main",
      type: "component",
      accepts: ["MainArea"],
      noInline: true,
    },
    {
      prop: "Footer",
      type: "component",
      required: true,
      accepts: ["AppShellFooter"],
    },
    {
      prop: "Sidebar",
      type: "component",
      required: true,
      accepts: ["AppShellSidebar"],
    },
    {
      prop: "isSidebarHidden",
      type: "boolean",
      label: "Hide sidebar",
    },
    {
      prop: "isFooterHidden",
      type: "boolean",
      label: "Hide footer",
    },
  ],
};

export { appShellDefinition };

import { NoCodeComponentDefinition } from "@easyblocks/core";
import { createButtonDefinition } from "@/app/easyblocks/components/createButtonDefinition";

const sidebarItemDefinition: NoCodeComponentDefinition = createButtonDefinition(
  {
    id: "SidebarItem",
    schema: [
      {
        prop: "label",
        label: "Label",
        type: "text",
      },
      {
        prop: "icon",
        label: "Icon",
        type: "select",
        params: {
          options: [
            "Home",
            "EnvelopeOpen",
            "Heart",
            "Person",
            "Gear",
            "MagnifyingGlass",
          ],
        },
      },
    ],
  }
);

export { sidebarItemDefinition };

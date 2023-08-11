import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { componentContainerStyles } from "./ComponentContainer.styles";

export const componentContainerDefinition: InternalRenderableComponentDefinition<"$ComponentContainer"> =
  {
    id: "$ComponentContainer",
    tags: ["notrace"],
    styles: componentContainerStyles,
    schema: [
      {
        prop: "width",
        type: "number",
      },
      {
        prop: "widthAuto",
        type: "boolean",
      },
      {
        prop: "Component",
        type: "component",
        componentTypes: ["section", "card", "button", "symbol", "item"],
      },
    ],
  };

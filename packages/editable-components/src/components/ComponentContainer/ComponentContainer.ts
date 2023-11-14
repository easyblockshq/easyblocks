import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { componentContainerStyles } from "./ComponentContainer.styles";

export const componentContainerDefinition: InternalRenderableComponentDefinition<"$ComponentContainer"> =
  {
    id: "$ComponentContainer",
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
        accepts: ["section", "card", "button", "symbol", "item"],
      },
    ],
  };

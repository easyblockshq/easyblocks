import { NoCodeComponentDefinition } from "@easyblocks/core";
import { componentContainerStyles } from "./ComponentContainer.styles";

// TODO: make it editor only
export const componentContainerDefinition: NoCodeComponentDefinition = {
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

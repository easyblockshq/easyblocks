import {
  buttonActionSchemaProp,
  InternalRenderableComponentDefinition,
} from "@easyblocks/core/_internals";
import playgroundStyles from "./Playground.styles";

// TODO: I really would like to get rid of this component in builtins and only keep it as editor only thing
const playgroundComponentDefinition: InternalRenderableComponentDefinition<"$Playground"> =
  {
    id: "$Playground",
    styles: playgroundStyles,
    schema: [
      {
        ...buttonActionSchemaProp,
        label: "Action",
      },
    ],
  };

export { playgroundComponentDefinition };

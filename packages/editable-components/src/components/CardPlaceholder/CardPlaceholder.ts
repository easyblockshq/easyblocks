import { InternalRenderableComponentDefinition } from "@easyblocks/app-utils";
import { cardPlaceholderStyles } from "./CardPlaceholder.styles";

export const cardPlaceholderDefinition: InternalRenderableComponentDefinition<"$CardPlaceholder"> =
  {
    id: "$CardPlaceholder",
    label: "Card Placeholder",
    type: "card",
    hideTemplates: true,
    styles: cardPlaceholderStyles,
    schema: [
      {
        prop: "font",
        type: "font",
        defaultValue: {
          ref: "$body",
          value: {},
        },
        visible: false,
      },
      {
        prop: "aspectRatio",
        label: "Aspect ratio",
        type: "stringToken",
        params: { tokenId: "aspectRatios" },
        defaultValue: {
          ref: "$portrait",
          value: "",
        },
        visible: false,
      },
      {
        prop: "backgroundColor",
        type: "color",
        defaultValue: {
          value: "rgb(242, 242, 242)",
        },
        visible: false,
      },
      {
        prop: "value",
        type: "string",
        defaultValue: "Product",
        visible: false,
      },
    ],
  };

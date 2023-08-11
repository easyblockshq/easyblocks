import { buttonActionSchemaProp } from "@easyblocks/app-utils";
import { ComponentSchemaProp } from "@easyblocks/core";

const richTextInlineWrapperActionSchemaProp: ComponentSchemaProp = {
  ...buttonActionSchemaProp,
  componentTypes: ["action"],
  label: "Link",
};

export { richTextInlineWrapperActionSchemaProp };

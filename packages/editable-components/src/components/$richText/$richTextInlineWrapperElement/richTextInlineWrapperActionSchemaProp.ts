import { buttonActionSchemaProp } from "@easyblocks/app-utils";
import { ComponentSchemaProp } from "@easyblocks/core";

const richTextInlineWrapperActionSchemaProp: ComponentSchemaProp = {
  // ...buttonActionSchemaProp,
  // accepts: ["action"],
  // label: "Link",
  //

  prop: "action",
  label: "Action",
  type: "component", // for now actions are components
  noInline: true,
  accepts: ["action"],
  visible: true,
  group: "Action",
  defaultValue: [],
  isLabelHidden: true,
};

export { richTextInlineWrapperActionSchemaProp };

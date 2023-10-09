import { buttonActionSchemaProp } from "@easyblocks/app-utils";
import { ComponentSchemaProp } from "@easyblocks/core";

const richTextInlineWrapperActionSchemaProp: ComponentSchemaProp = {
  // ...buttonActionSchemaProp,
  // componentTypes: ["action"],
  // label: "Link",
  //

  prop: "action",
  label: "Action",
  type: "component", // for now actions are components
  noInline: true,
  componentTypes: ["action"],
  visible: true,
  group: "Action",
  defaultValue: [],
  isLabelHidden: true,
};

export { richTextInlineWrapperActionSchemaProp };

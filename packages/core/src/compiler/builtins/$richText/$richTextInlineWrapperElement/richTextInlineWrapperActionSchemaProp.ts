import { ComponentSchemaProp } from "../../../../types";

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
  isLabelHidden: true,
  // @ts-ignore
  defaultValue: [],
};

export { richTextInlineWrapperActionSchemaProp };

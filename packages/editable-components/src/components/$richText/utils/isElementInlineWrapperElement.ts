import { Element, Node } from "slate";
import { InlineWrapperElement } from "../$richText.types";

function isElementInlineWrapperElement(
  node: Node
): node is InlineWrapperElement {
  return Element.isElementType<InlineWrapperElement>(node, "inline-wrapper");
}

export { isElementInlineWrapperElement };

import { spacingToPx } from "@easyblocks/app-utils";
import { box } from "../../box";
import { CompiledComponentStylesToolkit } from "../../types";
import { StackCompiledValues } from "./Stack.types";

export default function (
  compiled: StackCompiledValues,
  { device, $width, compilationContext }: CompiledComponentStylesToolkit
) {
  if ($width === -1) {
    throw new Error("$stack without width!!!");
  }

  // Legacy -> if we get passedAlign from external, we use it "by force"
  if (compiled.passedAlign) {
    compiled.Items = compiled.Items.map((item: any) => ({
      ...item,
      align: compiled.passedAlign,
    }));
  }

  // here we must apply default for placeholder!
  const items =
    compiled.Items.length > 0
      ? compiled.Items
      : [
          {
            marginBottom: 0,
            escapeMargin: false,
            width: "512px",
            align: compiled.passedAlign ?? "left",
          },
        ];

  const itemWrappers = items.map((item: any, index: number) => {
    let maxWidth = item.width;
    if (isNaN(parseInt(maxWidth))) {
      maxWidth = "10000px"; // auto when not a pixel value -> and this is the default value!
    }

    let flexAlign = "center";
    if (item.align === "left") {
      flexAlign = "flex-start";
    } else if (item.align === "right") {
      flexAlign = "flex-end";
    }

    const isChildRichText =
      "_template" in item &&
      item._template === "$richText" &&
      !compilationContext.isEditing;

    return {
      StackItemOuter: box({
        display: "flex",
        justifyContent: flexAlign,
        paddingLeft: !item.escapeMargin ? compiled.paddingLeft : 0,
        paddingRight: !item.escapeMargin ? compiled.paddingRight : 0,
        paddingTop:
          (index === 0 || compiled.Items.length === 0) && !item.escapeMargin
            ? compiled.paddingTop
            : 0,
        paddingBottom:
          (index === compiled.Items.length - 1 ||
            compiled.Items.length === 0) &&
          !item.escapeMargin
            ? compiled.paddingBottom
            : 0,
      }),

      StackItemInner: box({
        position: "relative",
        maxWidth: "100%",
        width: maxWidth,
        marginBottom: index === items.length - 1 ? 0 : item.marginBottom,
        // If stack item contains $richText it doesn't have to be interactive by default.
        // If that $richText would contain action, only that part will be interactive and that is handled by $richTextInlineWrapper.
        // For now, if child is something else we enable interactivity just in case.
        pointerEvents: isChildRichText ? "none" : "auto",
      }),
    };
  });

  return {
    StackContainer: box({
      display: "grid",
    }),
    itemWrappers,
    Items: {
      itemProps: compiled.Items.map((item) => {
        return {
          passedAlign: item.align,
          $width: Math.min(
            item.width === "max" ? Number.MAX_VALUE : parseInt(item.width),
            $width -
              spacingToPx(compiled.paddingLeft ?? "0px", device.w) -
              spacingToPx(compiled.paddingRight ?? "0px", device.w)
          ),
          $widthAuto: false,
        };
      }),
    },
  };
}

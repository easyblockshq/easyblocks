import type {
  NoCodeComponentStylesFunctionInput,
  NoCodeComponentStylesFunctionResult,
} from "@easyblocks/core";
import { spacingToPx } from "@easyblocks/core";
import type { StackCompiledValues, StackParams } from "./Stack.types";

export default function ({
  values,
  params,
  isEditing,
  device,
}: NoCodeComponentStylesFunctionInput<
  StackCompiledValues,
  StackParams
>): NoCodeComponentStylesFunctionResult {
  // Legacy -> if we get passedAlign from external, we use it "by force"
  if (params.passedAlign) {
    values.Items = values.Items.map((item) => ({
      ...item,
      align: params.passedAlign!,
    }));
  }

  // here we must apply default for placeholder!
  const items =
    values.Items.length > 0
      ? values.Items
      : [
          {
            marginBottom: 0,
            escapeMargin: false,
            width: "512px",
            align: params.passedAlign ?? "left",
          },
        ];

  const outerItemWrappers: Array<Record<string, any>> = [];
  const innerItemWrappers: Array<Record<string, any>> = [];

  items.forEach((item: any, index: number) => {
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
      item._template === "@easyblocks/rich-text" &&
      !isEditing;

    outerItemWrappers.push({
      display: "flex",
      justifyContent: flexAlign,
      paddingLeft: !item.escapeMargin ? params.paddingLeft : 0,
      paddingRight: !item.escapeMargin ? params.paddingRight : 0,
      paddingTop:
        (index === 0 || values.Items.length === 0) && !item.escapeMargin
          ? params.paddingTop
          : 0,
      paddingBottom:
        (index === values.Items.length - 1 || values.Items.length === 0) &&
        !item.escapeMargin
          ? params.paddingBottom
          : 0,
    });

    innerItemWrappers.push({
      position: "relative",
      maxWidth: "100%",
      width: maxWidth,
      marginBottom: index === items.length - 1 ? 0 : item.marginBottom,
      // If stack item contains $richText it doesn't have to be interactive by default.
      // If that $richText would contain action, only that part will be interactive and that is handled by $richTextInlineWrapper.
      // For now, if child is something else we enable interactivity just in case.
      pointerEvents: isChildRichText ? "none" : "auto",
    });
  });

  return {
    styled: {
      StackContainer: {
        display: "grid",
      },
      innerItemWrappers,
      outerItemWrappers,
    },

    components: {
      Items: {
        itemProps: values.Items.map((item) => {
          return {
            passedAlign: item.align,
            $width: Math.min(
              item.width === "max" ? Number.MAX_VALUE : parseInt(item.width),
              params.$width -
                spacingToPx(params.paddingLeft ?? "0px", device.w) -
                spacingToPx(params.paddingRight ?? "0px", device.w)
            ),
            $widthAuto: false,
          };
        }),
      },
    },
  };
}

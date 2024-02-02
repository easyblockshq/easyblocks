import { EditingInfo, SchemaProp } from "@easyblocks/core";
import { pxValueNormalize } from "@/app/easyblocks/components/utils/pxValueNormalize";
import { getFieldProvider } from "@/app/easyblocks/components/utils/getFieldProvider";

function borderSchemaProp(
  prop: string,
  label: string,
  group: string
): SchemaProp {
  return {
    prop: prop,
    label,
    group,
    type: "string",
    params: {
      normalize: pxValueNormalize(0, 32),
    },
    defaultValue: "1",
  };
}

export function bordersStyles(values: Record<string, any>) {
  const {
    enableBorder,
    borderColor,
    borderLeft,
    borderRight,
    borderTop,
    borderBottom,
  } = values;

  return {
    borderLeft: enableBorder ? `${borderLeft}px solid ${borderColor}` : "none",
    borderRight: enableBorder
      ? `${borderRight}px solid ${borderColor}`
      : "none",
    borderTop: enableBorder ? `${borderTop}px solid ${borderColor}` : "none",
    borderBottom: enableBorder
      ? `${borderBottom}px solid ${borderColor}`
      : "none",
  };
}

export function bordersEditing(
  editingInfo: EditingInfo,
  values: Record<string, any>
) {
  const getField = getFieldProvider(editingInfo);

  const borderColor = getField("borderColor");
  const borderLeft = getField("borderLeft");
  const borderRight = getField("borderRight");
  const borderTop = getField("borderTop");
  const borderBottom = getField("borderBottom");

  if (!values.enableBorder) {
    borderColor.visible = false;
    borderLeft.visible = false;
    borderRight.visible = false;
    borderTop.visible = false;
    borderBottom.visible = false;
  }
}

export const borderSchemaProps: SchemaProp[] = [
  {
    prop: "enableBorder",
    label: "Enable",
    group: "Border",
    type: "boolean",
    responsive: true,
  },
  {
    prop: "borderColor",
    label: "Color",
    group: "Border",
    type: "color",
    responsive: true,
  },
  borderSchemaProp("borderLeft", "Left", "Border"),
  borderSchemaProp("borderRight", "Right", "Border"),
  borderSchemaProp("borderTop", "Top", "Border"),
  borderSchemaProp("borderBottom", "Bottom", "Border"),
];

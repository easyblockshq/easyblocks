import {
  getDevicesWidths,
  responsiveValueFill,
  responsiveValueForceGet,
} from "@easyblocks/app-utils";
import { RefValue, ResponsiveValue, ThemeRefValue } from "@easyblocks/core";
import { entries } from "@easyblocks/utils";
import React from "react";
import { EditorContextType, useEditorContext } from "../../../EditorContext";
import { FieldMixedValue } from "../../../types";
import type { FieldRenderProps } from "../../form-builder";
import { TokenField, TokenFieldComponent } from "./TokenField/TokenFieldPlugin";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

type FontToken = ThemeRefValue<
  ResponsiveValue<
    ResponsiveValue<{
      fontSize: number | string;
      lineHeight: number | string;
    }>
  >
>;

type FontTokenField = TokenField<FontToken["value"]>;

type FontTokenFieldProps = FieldRenderProps<
  RefValue<string> | FieldMixedValue,
  HTMLElement
> & {
  field: FontTokenField;
};

function FontTokenField({ input, field, meta }: FontTokenFieldProps) {
  const editorContext = useEditorContext();

  const tokens = Object.fromEntries(
    entries(field.tokens).map(([name, token]) => {
      const labelledToken = {
        ...token,
        label: getFontTokenLabel(name, token, editorContext),
      };

      return [name, labelledToken];
    })
  );

  return (
    <TokenFieldComponent
      input={input}
      meta={meta}
      field={{
        ...field,
        tokens,
      }}
    />
  );
}

const FontTokenFieldPlugin = {
  name: "fontToken",
  type: "fontToken",
  Component: wrapFieldsWithMeta(FontTokenField),
};

export { FontTokenFieldPlugin };

function getFontTokenLabel(
  name: string,
  token: FontTokenField["tokens"][number],
  editorContext: EditorContextType
) {
  const filledResponsiveFontValue = responsiveValueFill(
    token.value,
    editorContext.devices,
    getDevicesWidths(editorContext.devices)
  );

  const currentDeviceFontValue = responsiveValueForceGet(
    filledResponsiveFontValue,
    editorContext.breakpointIndex
  );

  if (isValidFontTokenValue(currentDeviceFontValue)) {
    return `${token.label ?? name} (${stripPxUnit(
      currentDeviceFontValue.fontSize
    )}/${stripPxUnit(currentDeviceFontValue.lineHeight)})`;
  }

  return token.label ?? name;
}

function stripPxUnit(value: number | string) {
  if (typeof value === "number") {
    return value;
  }

  return value.replace(new RegExp("px"), "");
}

function isValidFontTokenValue(value: unknown): value is {
  fontSize: number | string;
  lineHeight: number | string;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "fontSize" in value &&
    "lineHeight" in value
  );
}

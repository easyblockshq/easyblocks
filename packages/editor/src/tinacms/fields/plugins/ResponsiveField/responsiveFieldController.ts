import { Form } from "@easyblocks/app-utils";
import {
  isTrulyResponsiveValue,
  responsiveValueForceGet,
} from "@easyblocks/core";
import { InternalField } from "@easyblocks/core/_internals";
import { dotNotationGet, toArray } from "@easyblocks/utils";
import { EditorContextType } from "../../../../EditorContext";

export type ResponsiveFieldDefinition = Omit<InternalField, "component"> & {
  component: "responsive2";
  subComponent: string;
  hasAuto?: boolean;
};

export type ResponsiveFieldController = {
  field: InternalField;
  isResponsive: boolean;
  isSet: boolean;
  reset: () => void;
  toggleOffAuto: () => void;
};

function getSavedValue(
  value: any,
  previousValue: any,
  editorContext: EditorContextType
) {
  const breakpointIndex = editorContext.breakpointIndex;

  if (typeof value === "string" && value.startsWith("##")) {
    // return value; -- commented based on comments below
    // we could potentially change that logic to setting only the current breakpoint. There are use cases when this makes sense.
    // 1. If we have a section "from library" with some default and we change value to responsive, we usually want to change it for all breakpoints.
    // 2. However, if we set mobile and go to desktop and change value to responsive, we actually want to set it only to a specific breakpoint and not touch mobile.
    // 3. If default were responsive, it'd be easier and we'd go with 2.
    // 4. Changing entire set to responsive value is dangerous if someone set some breakpoint nicely. It would break.
  }

  // Responsiveness is not enabled for this field
  if (!isTrulyResponsiveValue(previousValue)) {
    if (value === undefined || value === null) {
      return null;
    }

    return value;
  }

  const result = { ...previousValue };
  result[breakpointIndex] = value;
  return result;
}

export function responsiveFieldController(config: {
  field: ResponsiveFieldDefinition;
  formValues: Form["values"];
  onChange: (newValues: Array<any>) => void;
  editorContext: EditorContextType;
  valuesAfterAuto: Record<string, any>;
}): ResponsiveFieldController {
  const { field, formValues, onChange, editorContext, valuesAfterAuto } =
    config;

  function originalFormat(value: unknown, fieldName: string) {
    return field.format?.(value, fieldName, field) ?? value;
  }

  function originalParse(value: unknown, fieldName: string) {
    return field.parse?.(value, fieldName, field) ?? value;
  }

  const normalizedFieldName = toArray(field.name);

  const fieldValues = normalizedFieldName.map((fieldName) =>
    dotNotationGet(formValues, fieldName)
  );

  const isResponsive = fieldValues.every((fieldValue) =>
    isTrulyResponsiveValue(fieldValue)
  );

  const isSet =
    isResponsive &&
    fieldValues.every(
      (fieldValue) => fieldValue[editorContext.breakpointIndex] !== undefined
    );

  const format = (value: any, name: string) => {
    const valueAfterFormat = originalFormat(value, name);
    const displayedValue =
      (isTrulyResponsiveValue(valueAfterFormat)
        ? valueAfterFormat[editorContext.breakpointIndex]
        : valueAfterFormat) ?? null;
    return displayedValue;
  };

  const parse = (value: any, name: string) => {
    if (value === null) {
      throw new Error(
        "parse in ResponsiveController has null value which should be impossible (null values should disappear once other value is picked!"
      );
    }

    const fieldValue = originalFormat(dotNotationGet(formValues, name), name);
    const savedValue = getSavedValue(value, fieldValue, editorContext);

    return originalParse(savedValue, name);
  };

  const reset = () => {
    if (!isResponsive) {
      throw new Error("should never happen");
    }

    const nextValues = normalizedFieldName.map((fieldName) => {
      const previousValue = originalFormat(
        dotNotationGet(formValues, fieldName),
        fieldName
      );

      const newValue = {
        ...previousValue,
      };

      delete newValue[editorContext.breakpointIndex];

      if (Object.keys(newValue).length <= 1) {
        return field.defaultValue;
      }

      return originalParse(newValue, fieldName);
    });

    onChange(nextValues);
  };

  const toggleOffAuto = () => {
    const currentBreakpointValues = fieldValues.map(
      (fieldValue) => fieldValue[editorContext.breakpointIndex]
    );

    let areAllFieldValuesAuto = true;
    let isAnyFieldValueAuto = false;

    currentBreakpointValues.forEach((value) => {
      if (value === undefined) {
        if (!isAnyFieldValueAuto) {
          isAnyFieldValueAuto = true;
        }
      } else {
        if (areAllFieldValuesAuto) {
          areAllFieldValuesAuto = false;
        }
      }
    });

    const newFieldsValues = normalizedFieldName.map((fieldName) => {
      const fieldValue = dotNotationGet(formValues, fieldName);
      const nextFieldValue = areAllFieldValuesAuto
        ? dotNotationGet(valuesAfterAuto, normalizedFieldName[0])
        : isAnyFieldValueAuto
        ? fieldValues.find(
            (value) => value[editorContext.breakpointIndex] !== undefined
          )
        : fieldValue;

      const newFieldValue = {
        ...fieldValue,
        [editorContext.breakpointIndex]: responsiveValueForceGet(
          // next field comes from auto, so value is defined
          nextFieldValue,
          editorContext.breakpointIndex
        ),
      };

      return newFieldValue;
    });

    onChange(newFieldsValues);
  };

  const valueField: InternalField = {
    ...field,
    component: field.subComponent,
    format,
    parse,
  };

  return {
    field: valueField,
    isResponsive,
    isSet,
    reset,
    toggleOffAuto,
  };
}

import { isResolvedCompoundExternalDataValue } from "@easyblocks/app-utils";
import {
  ExternalTextValue,
  getFallbackForLocale,
  getResourceId,
  LocalTextValue,
  UnresolvedResource,
} from "@easyblocks/core";
import { SSInput } from "@easyblocks/design-system";
import { cleanString, dotNotationGet } from "@easyblocks/utils";
import debounce from "lodash/debounce";
import React, { ComponentType, useRef } from "react";
import { FieldRenderProps } from "react-final-form";
import { useEditorContext } from "../../../EditorContext";
import { useEditorExternalData } from "../../../EditorExternalDataProvider";
import { InternalWidgetComponentProps } from "../../../types";
import {
  CompoundResourceValueSelect,
  getBasicResourcesOfType,
} from "./ExternalField/ExternalField";
import { ExternalValueWidgetsMenu } from "./ResponsiveField/ExternalValueWidgetsMenu";
import { parse } from "./textFormat";
import { FieldMetaWrapper } from "./wrapFieldWithMeta";

export function useTextValue(
  value: any,
  onChange: any,
  defaultPlaceholder?: string,
  normalize?: (x: string) => string | null
) {
  const {
    contextParams: { locale },
    locales,
  } = useEditorContext();

  const isExternal = typeof value === "object" && value !== null;
  const fallbackValue = isExternal
    ? getFallbackForLocale(value.value, locale, locales)
    : undefined;

  const valueFromProps = (() => {
    if (isExternal) {
      let displayedValue = value.value?.[locale];
      if (typeof displayedValue !== "string") {
        displayedValue = fallbackValue ?? "";
      }

      return displayedValue;
    }
    return value ?? "";
  })();

  const previousValue = useRef(valueFromProps);

  const [localInputValue, setLocalInputValue] = React.useState(valueFromProps);

  function saveNewValue(newValue: string | null) {
    if (isExternal) {
      const newExternalValue = {
        ...value,
        value: {
          ...value.value,
          [locale]: newValue,
        },
      };

      onChange(newExternalValue);
    } else {
      onChange(newValue);
    }
  }

  const onChangeDebounced = React.useCallback(
    debounce((newValue: string) => {
      // If normalization is on, we shouldn't save on change
      if (normalize) {
        return;
      }

      saveNewValue(newValue);
    }, 500),
    [isExternal]
  );

  function handleBlur() {
    onChangeDebounced.cancel();

    let newValue = localInputValue;

    if (normalize) {
      const normalized = normalize(newValue);
      if (normalized === null) {
        newValue = previousValue.current;
      } else {
        newValue = normalized;
        previousValue.current = localInputValue;
      }
    }

    setLocalInputValue(newValue);

    if (isExternal) {
      if (newValue.trim() === "") {
        saveNewValue(null);
        setLocalInputValue(fallbackValue ?? "");
      } else {
        saveNewValue(newValue);
      }
    } else {
      if (value !== newValue) {
        saveNewValue(newValue);
      }
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setLocalInputValue(event.target.value);
    onChangeDebounced(event.target.value);
  }

  // Sync local value with value from the config if the field value has been
  // changed from outside
  React.useEffect(() => {
    setLocalInputValue(valueFromProps);
  }, [valueFromProps]);

  const style: any = {
    opacity: localInputValue === fallbackValue ? 0.5 : 1,
  };

  return {
    onChange: handleChange,
    onBlur: handleBlur,
    value: cleanString(localInputValue),
    style,
    placeholder: defaultPlaceholder ?? "Enter text",
  };
}

type TextFieldProps = FieldRenderProps<LocalTextValue | ExternalTextValue, any>;

export function TextField({ input, field, form }: TextFieldProps) {
  const { value, onChange, ...restInputProperties } = input;
  const editorContext = useEditorContext();

  const inputProps = useTextValue(
    value,
    onChange,
    field.placeholder,
    (field as any).normalize
  );

  const externalData = useEditorExternalData();

  const fieldExternalDataId = getResourceId(
    dotNotationGet(
      editorContext.form.values,
      field.name.split(".").slice(0, -1).join(".")
    )._id,
    field.schemaProp.prop
  );

  const isInputValueExternalTextValue = isExternalTextValue(value);

  const externalDataValue = isInputValueExternalTextValue
    ? externalData[fieldExternalDataId]
    : null;

  const WidgetComponent = editorContext.resourceTypes["text"].widgets.find(
    (w) => "widgetId" in input.value && w.id === input.value.widgetId
  )?.component as ComponentType<InternalWidgetComponentProps> | undefined;

  const isCompoundResourceValueSelectVisible =
    isInputValueExternalTextValue &&
    value.id !== null &&
    !value.id.startsWith("$.") &&
    externalDataValue != null &&
    isResolvedCompoundExternalDataValue(externalDataValue);

  return (
    <FieldMetaWrapper
      field={field}
      input={input}
      form={form}
      layout="column"
      renderDecoration={() => {
        const widgets = [
          ...(editorContext.resourceTypes["text"]?.widgets ?? []),
        ];

        widgets.unshift({
          id: "@easyblocks/local-text",
          label: "Local text",
          component: () => {
            return null;
          },
        });

        if (widgets.length === 1) {
          return null;
        }

        return (
          <ExternalValueWidgetsMenu
            widgets={widgets}
            selectedWidgetId={
              "widgetId" in value ? value.widgetId : widgets[0].id
            }
            onChange={(widgetId) => {
              const newValue: UnresolvedResource = {
                id: null,
                widgetId,
              };

              onChange(newValue);
            }}
          />
        );
      }}
    >
      <div
        css={`
          display: flex;
          gap: 8px;
          width: 100%;
        `}
      >
        {WidgetComponent && isInputValueExternalTextValue ? (
          <div
            css={`
              display: flex;
              flex-direction: column;
              gap: 8px;
              align-items: flex-start;
              flex-grow: 1;
            `}
          >
            <WidgetComponent
              id={value.id}
              resourceKey={"key" in value ? value.key : undefined}
              onChange={(newId, newKey) => {
                const newValue: ExternalTextValue = {
                  id: newId,
                  widgetId: value.widgetId,
                };

                if (newKey) {
                  newValue.key = newKey;
                }

                onChange(newValue);
              }}
            />
            {isCompoundResourceValueSelectVisible && (
              <CompoundResourceValueSelect
                options={getBasicResourcesOfType(
                  externalDataValue.value,
                  "text"
                ).map((r) => ({
                  id: value.id!,
                  key: r.key,
                  label: r.label ?? r.key,
                }))}
                resource={
                  value.id === null
                    ? {
                        id: value.id,
                        key: undefined,
                      }
                    : {
                        id: value.id,
                        key: value.key,
                      }
                }
                onResourceKeyChange={(_, key) => {
                  input.onChange({
                    ...value,
                    key,
                  });
                }}
              />
            )}
          </div>
        ) : (
          <SSInput
            {...restInputProperties}
            {...inputProps}
            icon={field.icon}
            controlSize="full-width"
            withBorder
          />
        )}
      </div>
    </FieldMetaWrapper>
  );
}

export const TextFieldPlugin = {
  name: "text",
  Component: TextField,
  parse,
};

function isExternalTextValue(
  value: LocalTextValue | ExternalTextValue
): value is ExternalTextValue {
  return !("value" in value);
}

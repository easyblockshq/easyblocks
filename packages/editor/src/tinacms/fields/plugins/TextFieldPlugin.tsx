import { getFallbackForLocale } from "@easyblocks/core";
import { SSInput } from "@easyblocks/design-system";
import { cleanString } from "@easyblocks/utils";
import debounce from "lodash/debounce";
import React, { useRef } from "react";
import { useEditorContext } from "../../../EditorContext";
import { parse } from "./textFormat";
import { wrapFieldsWithMeta } from "./wrapFieldWithMeta";

type InputProps = {
  error?: boolean;
  small?: boolean;
  placeholder?: string;
  step?: string | number;
  icon?: any;
};

export function useTextValue(
  value: any,
  onChange: any,
  defaultPlaceholder?: string,
  normalize?: (x: string) => string | null
) {
  const {
    actions,
    contextParams: { locale },
    locales,
  } = useEditorContext();

  const isExternal = typeof value === "object" && value !== null;
  const fallbackValue = isExternal
    ? getFallbackForLocale(value.value, locale, locales)
    : undefined;

  const valueFromProps = (() => {
    if (isExternal) {
      let displayedValue = value.value[locale];
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
    actions.runChange(() => {
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
    });
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

export const TextField = wrapFieldsWithMeta<
  {
    placeholder: string;
    icon?: any;
  },
  InputProps
>(({ input, field }) => {
  const { value, onChange, ...restInputProperties } = input;

  const inputProps = useTextValue(
    value,
    onChange,
    field.placeholder,
    (field as any).normalize
  );

  return (
    <SSInput
      {...restInputProperties}
      {...inputProps}
      icon={field.icon}
      align={"right"}
    />
  );
});

export const TextFieldPlugin = {
  name: "text",
  Component: TextField,
  validate(value: any, values: any, meta: any, field: any) {
    if (field.required && !value) return "Required";
  },
  parse,
};

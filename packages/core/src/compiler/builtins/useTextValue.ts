import { cleanString } from "@easyblocks/utils";
import debounce from "lodash/debounce";
import React from "react";
import { Locale, getFallbackForLocale } from "../../locales";

export function useTextValue(
  value: any,
  onChange: any,
  locale: string,
  locales: Array<Locale>,
  defaultPlaceholder?: string,
  normalize?: (x: string) => string | null
) {
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

  const previousValue = React.useRef(valueFromProps);

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

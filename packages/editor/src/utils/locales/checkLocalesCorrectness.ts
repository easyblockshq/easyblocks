import { getDefaultLocale, Locale } from "@easyblocks/core";

export function checkLocalesCorrectness(locales: Locale[]): boolean {
  if (locales.length === 0) {
    throw new Error("Locales array can't be empty");
  }

  const defaultLocales = locales.filter((l) => l.isDefault);
  if (defaultLocales.length === 0) {
    throw new Error("One locale must be set as default, you didn't set any");
  }

  if (defaultLocales.length > 1) {
    throw new Error(
      "Only one locale must be set as default, you set more than one"
    );
  }

  const defaultLocale = defaultLocales[0];

  if (defaultLocale.fallback) {
    throw new Error("Default locale can't have fallback");
  }

  // Check for incorrect fallbacks
  locales.forEach((locale) => {
    if (locale.fallback) {
      const fallback = locales.find((x) => x.code === locale.fallback);

      if (!fallback) {
        throw new Error(
          `Locale ${locale} has a fallback ${locale.fallback} which doesn't exist in the locales list.`
        );
      }
    }
    // If there is no fallback, then we treat default locale as a fallback!
  });

  // Let's check for circulars
  locales.forEach((locale) => {
    const localeChain: string[] = [];

    let currentLocale = locale;

    do {
      localeChain.push(currentLocale.code);
      const fallbackId =
        currentLocale.fallback ?? getDefaultLocale(locales).code;

      // If we got to the default locale then we're fine
      if (fallbackId === getDefaultLocale(locales).code) {
        break;
      }

      // If fallbackId does already exists in localeChain then it means we have circular!
      if (localeChain.includes(fallbackId)) {
        throw new Error(
          `There is circular reference in locales: ${[
            ...localeChain,
            fallbackId,
          ].join(",")}`
        );
      }

      currentLocale = locales.find((x) => x.code === fallbackId)!;
    } while (true);
  });

  return true;
}

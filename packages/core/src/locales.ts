export type Locale = {
  code: string;
  isDefault?: boolean;
  fallback?: string;
};

export function getDefaultLocale(locales: Locale[]): Locale {
  const defaultLocale = locales.find((locale) => locale.isDefault);

  if (!defaultLocale) {
    throw new Error("No default locale found");
  }

  return defaultLocale;
}

export function getFallbackLocaleForLocale(
  locale: string,
  locales: Locale[]
): string | undefined {
  do {
    const fallbackId =
      locales.find((l) => l.code === locale)?.fallback ??
      getDefaultLocale(locales).code;

    // Default locale, no fallback
    if (fallbackId === locale) {
      return;
    }

    return fallbackId;
  } while (true);
}

export function getFallbackForLocale<T>(
  translatedValues: { [locale: string]: T | undefined | null },
  locale: string,
  locales: Locale[]
): T | undefined {
  while (true) {
    const fallbackLocale = getFallbackLocaleForLocale(locale, locales);

    if (!fallbackLocale) {
      return;
    }

    const fallbackValue = translatedValues[fallbackLocale];

    if (fallbackValue !== undefined && fallbackValue !== null) {
      return fallbackValue;
    }

    locale = fallbackLocale;
  }
}

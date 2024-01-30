import {
  NoCodeComponentEntry,
  getFallbackForLocale,
  Locale,
} from "@easyblocks/core";

function isLocalizedText(entry: NoCodeComponentEntry) {
  const LOCAL_PREFIX = "local.";
  return (entry?.id ?? "").startsWith(LOCAL_PREFIX);
}

function extractSingleLocaleConfigs(
  entry: NoCodeComponentEntry,
  localeCode: string,
  locales: Locale[]
): any {
  if (entry === null) {
    return;
  }
  if (typeof entry !== "object") {
    return entry;
  }
  if (Array.isArray(entry)) {
    return entry.map((value) =>
      extractSingleLocaleConfigs(value, localeCode, locales)
    );
  }
  if (entry.__localized !== true) {
    return Object.fromEntries(
      Object.entries(entry).map(([key, value]) => {
        return [key, extractSingleLocaleConfigs(value, localeCode, locales)];
      })
    );
  }
  if (isLocalizedText(entry)) {
    const stringValue = entry?.value?.[localeCode];
    if (stringValue === null || stringValue === undefined) {
      return {
        id: entry.id,
        value: {
          [localeCode]: getFallbackForLocale(entry.value, localeCode, locales),
          __fallback: true,
        },
      };
    } else {
      return {
        id: entry.id,
        value: {
          [localeCode]: stringValue,
        },
      };
    }
  }

  const localeCollection = entry[localeCode];
  if (localeCollection) {
    return {
      [localeCode]: extractSingleLocaleConfigs(
        localeCollection,
        localeCode,
        locales
      ),
    };
  } else {
    return {
      [localeCode]: extractSingleLocaleConfigs(
        getFallbackForLocale(entry, localeCode, locales),
        localeCode,
        locales
      ),
      __fallback: true,
    };
  }
}

/**
 * Our Editor always works with one Config where each text is represented by localized object like:
 *
 * {
 *  en: "Hello",
 *  pl: "Dzień dobry",
 *  de: "Halo"
 * }
 *
 * This is easy for us to manage, however this is not a good format for API output, because you never really render all the langauges at once so providing all the langauges is hugely redundant.
 *
 * That's why when we save to the CMS, we save separate configs for each language with ONLY THIS LANGUAGE in texts.
 *
 * So English will have texts like { en: "Hello" } and Polish will have { de: "Dzień dobry" }, etc.
 *
 * Those single-locale configs saved in CMS have a name: SingleLocaleConfig.
 *
 */

function splitConfigIntoSingleLocaleConfigs(
  config: NoCodeComponentEntry,
  locales: Locale[]
) {
  const localisedConfigs: { [locale: string]: NoCodeComponentEntry } = {};

  locales.forEach((locale) => {
    localisedConfigs[locale.code] = extractSingleLocaleConfigs(
      config,
      locale.code,
      locales
    );
  });

  return localisedConfigs;
}

export { splitConfigIntoSingleLocaleConfigs };

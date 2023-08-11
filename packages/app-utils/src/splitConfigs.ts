import {
  ConfigComponent,
  getFallbackForLocale,
  Locale,
} from "@easyblocks/core";

function isLocalizedText(configComponent: ConfigComponent) {
  const LOCAL_PREFIX = "local.";
  return (configComponent?.id ?? "").startsWith(LOCAL_PREFIX);
}

function extractSingleLocaleConfigs(
  configComponent: ConfigComponent,
  localeCode: string,
  locales: Locale[]
): any {
  if (configComponent === null) {
    return;
  }
  if (typeof configComponent !== "object") {
    return configComponent;
  }
  if (Array.isArray(configComponent)) {
    return configComponent.map((value) =>
      extractSingleLocaleConfigs(value, localeCode, locales)
    );
  }
  if (configComponent.__localized !== true) {
    return Object.fromEntries(
      Object.entries(configComponent).map(([key, value]) => {
        return [key, extractSingleLocaleConfigs(value, localeCode, locales)];
      })
    );
  }
  if (isLocalizedText(configComponent)) {
    const stringValue = configComponent?.value?.[localeCode];
    if (stringValue === null || stringValue === undefined) {
      return {
        id: configComponent.id,
        value: {
          [localeCode]: getFallbackForLocale(
            configComponent.value,
            localeCode,
            locales
          ),
          __fallback: true,
        },
      };
    } else {
      return {
        id: configComponent.id,
        value: {
          [localeCode]: stringValue,
        },
      };
    }
  }

  const localeCollection = configComponent[localeCode];
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
        getFallbackForLocale(configComponent, localeCode, locales),
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
  config: ConfigComponent,
  locales: Locale[]
) {
  const localisedConfigs: { [locale: string]: ConfigComponent } = {};

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

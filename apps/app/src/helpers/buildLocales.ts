import { Locale } from "@easyblocks/core";

function buildLocales(localeCodes: Array<string>) {
  const locales = localeCodes.reduce((locales, localeCode, index) => {
    const nextLocale = localeCodes[index + 1];

    if (!nextLocale) {
      locales.push({
        code: localeCode,
        isDefault: true,
      });
    } else {
      locales.push({
        code: localeCode,
        fallback: nextLocale,
      });
    }

    return locales;
  }, [] as Array<Locale>);

  return locales;
}

export { buildLocales };

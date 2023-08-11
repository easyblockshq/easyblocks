import {
  CompilationContextType,
  configMap,
  configTraverse,
  findComponentDefinition,
} from "@easyblocks/app-utils";
import {
  ConfigComponent,
  getFallbackForLocale,
  Locale,
  LocalisedConfigs,
} from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";

type TextMap = {
  [id: string]: {
    [locale: string]: {
      value: string | null | undefined;
      fallback?: string;
    };
  };
};

function updateTextMapForLocale(
  textMap: TextMap,
  config: ConfigComponent,
  locale: string,
  compilationContext: CompilationContextType,
  allowAddingNewTexts: boolean
) {
  configTraverse(config, compilationContext, ({ path, value, schemaProp }) => {
    if (schemaProp.type === "text" && value.id !== null) {
      if (allowAddingNewTexts || textMap[value.id]) {
        textMap[value.id] = textMap[value.id] ?? {};
        textMap[value.id][locale] = { value: value.value };
      }
    }
  });
}

function generateFallbacks(textMap: TextMap, locales: Locale[]) {
  for (const id in textMap) {
    const translatedEntry = textMap[id];
    const translatedValue: { [locale: string]: string | undefined | null } = {};

    for (const locale in translatedEntry) {
      translatedValue[locale] = translatedEntry[locale].value;
    }

    // we're trying to find fallback for locale locale and id/value
    locales.forEach((locale) => {
      if (!translatedEntry[locale.code]) {
        translatedEntry[locale.code] = {
          value: null,
        };
      }

      const fallback = getFallbackForLocale(
        translatedValue,
        locale.code,
        locales
      );

      if (fallback) {
        translatedEntry[locale.code].fallback = fallback;
      }
    });
  }
}

function getSyncedObject(
  component: ConfigComponent,
  textMap: TextMap,
  compilationContext: CompilationContextType
) {
  const componentDefinition = findComponentDefinition(
    component,
    compilationContext
  );

  if (!componentDefinition) {
    throw new Error("getSyncedObject: unknown component definition");
  }

  const ret: ConfigComponent = {
    ...component,
  };

  componentDefinition.schema.forEach((schemaProp) => {
    if (schemaProp.type === "text") {
      const id = component._id + schemaProp.prop;
      ret[schemaProp.prop] = textMap[id] || {
        id: "local." + uniqueId(),
        value: "",
      };
    } else if (schemaProp.type.startsWith("component")) {
      ret[schemaProp.prop] = (component[schemaProp.prop] || []).map(
        (subComponent: ConfigComponent) => {
          return getSyncedObject(subComponent, textMap, compilationContext);
        }
      );
    }
  });

  return ret;
}

export function syncConfigForLocales(
  configs: LocalisedConfigs,
  locale: string,
  locales: Locale[],
  newConfig: ConfigComponent,
  compilationContext: CompilationContextType
): LocalisedConfigs {
  const textMap: TextMap = {};

  updateTextMapForLocale(textMap, newConfig, locale, compilationContext, true);

  for (const configLocale in configs) {
    if (configLocale === locale) {
      continue;
    }

    updateTextMapForLocale(
      textMap,
      configs[configLocale],
      configLocale,
      compilationContext,
      false
    );
  }

  generateFallbacks(textMap, locales);

  const result: LocalisedConfigs = {};

  locales.forEach((locale) => {
    result[locale.code] = configMap(
      newConfig,
      compilationContext,
      ({ value, schemaProp }) => {
        if (schemaProp.type === "text") {
          return {
            id: value.id,
            ...textMap[value.id][locale.code],
          };
        }
        return value;
      }
    );
  });

  return result;

  // return getSyncedObject(lastModifiedConfig, textMap, compilationContext);
}

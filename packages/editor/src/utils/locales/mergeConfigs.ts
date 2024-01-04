import { configMap } from "@easyblocks/app-utils";
import {
  ComponentConfig,
  LocalisedConfigs,
  LocalizedText,
} from "@easyblocks/core";
import { CompilationContextType } from "@easyblocks/core/_internals";
import { dotNotationGet } from "@easyblocks/utils";

export const validateIntegrity = (
  configs: LocalisedConfigs,
  compilationContext: CompilationContextType
) => {
  const stripped = Object.values(configs).map((config) => {
    return configMap(config, compilationContext, ({ schemaProp, value }) => {
      if (
        schemaProp.type === "text" ||
        schemaProp.type === "component-collection-localised"
      ) {
        return;
      }
      return value;
    });
  });

  const stringifiedConfigs = stripped.map((c) =>
    JSON.stringify(c, Object.keys(c).sort())
  );

  return stringifiedConfigs.every((c) => c === stringifiedConfigs[0]);
};

export function mergeSingleLocaleConfigsIntoConfig(
  configs: { [locale: string]: ComponentConfig },
  compilationContext: CompilationContextType
) {
  if (Object.keys(configs).length === 0) {
    return;
  }

  if (!validateIntegrity(configs, compilationContext)) {
    throw Error(
      "You probably changed the value of the config for just one language"
    );
  }

  const anyConfig = configs[Object.keys(configs)[0]];

  return configMap(
    anyConfig,
    compilationContext,
    ({ value, schemaProp, path }) => {
      if (schemaProp.type === "text") {
        // Sometimes value can be undefined but it is still correct.
        // It happens when schema gets new property and config was not yet opened and saved with this new property.
        // We must simply preserve undefined in merged config, Editor will later normalize it and save back proper value.
        if (value === undefined) {
          return undefined;
        }

        if (value.id.startsWith("local.")) {
          const localizedText: LocalizedText = {};

          for (const locale in configs) {
            const textValue = dotNotationGet(configs[locale], path)?.value;
            if (textValue && !textValue.__fallback) {
              localizedText[locale] = textValue[locale];
            }
          }

          return {
            id: value.id,
            value: localizedText,
          };
        }
      } else if (schemaProp.type === "component-collection-localised") {
        if (value === undefined) {
          // as mentioned above in text schema prop
          return undefined;
        }

        const localisedCollection: { [locale: string]: ComponentConfig } = {};

        for (const locale in configs) {
          const value = dotNotationGet(configs[locale], path);
          if (!value.__fallback) {
            localisedCollection[locale] = value[locale];
          }
        }

        delete localisedCollection.__fallback;

        return localisedCollection;
      }

      return value;
    }
  );
}

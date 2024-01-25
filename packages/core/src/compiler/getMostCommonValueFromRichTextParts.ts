import { entries } from "@easyblocks/utils";
import { getFallbackForLocale } from "../locales";
import { DeviceRange } from "../types";
import { CompilationCache } from "./CompilationCache";
import { RichTextComponentConfig } from "./builtins/$richText/$richText";
import { RichTextBlockElementComponentConfig } from "./builtins/$richText/$richTextBlockElement/$richTextBlockElement";
import {
  RichTextPartComponentConfig,
  richTextPartEditableComponent,
} from "./builtins/$richText/$richTextPart/$richTextPart";
import { compileComponentValues } from "./compileComponentValues";
import { findComponentDefinitionById } from "./findComponentDefinition";
import { CompilationContextType, InternalComponentDefinition } from "./types";

/**
 * Returns the most common value for given `prop` parameter among all @easyblocks/rich-text-part components from `richTextComponentConfig`.
 */
function getMostCommonValueFromRichTextParts<
  RichTextPartProperty extends Extract<
    keyof RichTextPartComponentConfig,
    "color" | "font"
  >
>(
  richTextComponentConfig: RichTextComponentConfig,
  prop: RichTextPartProperty,
  compilationContext: CompilationContextType,
  cache: CompilationCache
) {
  const richTextBlockElements:
    | Array<RichTextBlockElementComponentConfig>
    | undefined =
    richTextComponentConfig.elements[compilationContext.contextParams.locale] ??
    getFallbackForLocale(
      richTextComponentConfig.elements,
      compilationContext.contextParams.locale,
      compilationContext.locales
    );

  if (!richTextBlockElements) {
    return;
  }

  const richTextParts = richTextBlockElements.flatMap((blockElement) => {
    return blockElement.elements.flatMap((lineElement) => {
      return lineElement.elements;
    });
  });

  const richTextPartComponentDefinition = findComponentDefinitionById(
    richTextPartEditableComponent.id,
    compilationContext
  )!;

  const deviceIdToRichTextPartValuesGroupedByPropValue = Object.fromEntries(
    compilationContext.devices
      .map((device) => {
        const richTextPartsCompiledPropValues = richTextParts.flatMap(
          (richTextPart) => {
            return mapRichTextPartToCompiledPropValue(
              richTextPart,
              richTextPartComponentDefinition,
              compilationContext,
              prop,
              cache
            );
          }
        );

        const richTextPartValuesLengthGroupedByPropValue =
          richTextPartsCompiledPropValues.reduce(
            (acc, current) =>
              groupTotalValueLengthByCompiledPropValue<RichTextPartProperty>(
                prop,
                device
              )(acc, current),
            {} as Record<string, number>
          );

        return [device.id, richTextPartValuesLengthGroupedByPropValue] as const;
      })
      .filter((entry) => Object.keys(entry[1]).length > 0)
      .map((entry) => {
        return [
          entry[0],
          getCompiledValueFromEntryWithMaxTotalValueLength(entry),
        ];
      })
  );

  if (
    Object.keys(deviceIdToRichTextPartValuesGroupedByPropValue).length === 0
  ) {
    return;
  }

  return { $res: true, ...deviceIdToRichTextPartValuesGroupedByPropValue };
}

export { getMostCommonValueFromRichTextParts };

function getCompiledValueFromEntryWithMaxTotalValueLength(
  entry: readonly [string, Record<string, number>]
): any {
  const compiledPropValue = entries(entry[1]).reduce((maxEntry, currentEntry) =>
    currentEntry[1] > maxEntry[1] ? currentEntry : maxEntry
  )[0];

  try {
    return JSON.parse(compiledPropValue);
  } catch {
    return compiledPropValue;
  }
}

function groupTotalValueLengthByCompiledPropValue<
  RichTextPartProperty extends Extract<
    keyof RichTextPartComponentConfig,
    "color" | "font"
  >
>(
  prop: RichTextPartProperty,
  device: DeviceRange
): (
  previousValue: Record<string, number>,
  currentValue: { [x: string]: any; value: string }
) => Record<string, number> {
  return (acc, current) => {
    const key = JSON.stringify(current[prop][device.id]);

    if (key === undefined) {
      return acc;
    }

    if (!acc[key]) {
      acc[key] = 0;
    }

    acc[key] += current.value.length;
    return acc;
  };
}

function mapRichTextPartToCompiledPropValue(
  richTextPart: RichTextPartComponentConfig,
  richTextPartComponentDefinition: InternalComponentDefinition,
  compilationContext: CompilationContextType,
  prop: string,
  cache: CompilationCache
) {
  const compiledValues = compileComponentValues(
    richTextPart,
    richTextPartComponentDefinition,
    compilationContext,
    cache
  );

  return {
    value: richTextPart.value,
    [prop]: compiledValues[prop],
  };
}

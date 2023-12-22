import {
  getDevicesWidths,
  getFallbackLocaleForLocale,
  isTrulyResponsiveValue,
  responsiveValueGetDefinedValue,
} from "@easyblocks/core";
import {
  CompilationCache,
  InternalAnyTinaField,
  InternalField,
  duplicateConfig,
  findComponentDefinitionById,
  findPathOfFirstAncestorOfType,
  getSchemaDefinition,
  parsePath,
  richTextChangedEvent,
  traverseComponents,
} from "@easyblocks/core/_internals";
import { dotNotationGet, last, toArray } from "@easyblocks/utils";
import { EditorContextType } from "../../../EditorContext";
import { getUniqueValues } from "../../fields/components/getUniqueValues";
import { isConfigPathRichTextPart } from "../../../utils/isConfigPathRichTextPart";

// "any" here is on purpose (although doesn't make sense from TS perspective).
// It suggests that in onChange you can pass event OR any value. It's a bit confusing and should be cleaned up in the future.
type FieldValue = React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | any;

function createFieldController({
  field,
  editorContext,
  format = (v) => v,
  parse = (v) => v,
}: {
  field: InternalField;
  editorContext: EditorContextType;
  format?:
    | ((value: any, name: string, field: InternalAnyTinaField) => any)
    | undefined;
  parse?: (value: any, name: string, field: InternalAnyTinaField) => any;
}) {
  const { actions, contextParams, form, locales, focussedField } =
    editorContext;
  const normalizedFieldName = toArray(field.name);

  return {
    onChange(mainNewValue: FieldValue, ...extraNewValues: FieldValue[]) {
      /**
       * There are 2 modes of onChange: single param and multiple params
       *
       * 1. single param mode is when onChange is given ONE value (1 parameter). It means: "apply this value for all selected fields"
       * 2. multiple param mode is when onChange is given more than one value. It means: "apply each value for respective selected field".
       */

      const newValue: FieldValue | FieldValue[] =
        extraNewValues.length === 0
          ? mainNewValue
          : [mainNewValue, ...extraNewValues];

      if (
        !Array.isArray(mainNewValue) &&
        Array.isArray(newValue) &&
        newValue.length !== normalizedFieldName.length
      ) {
        throw new Error(
          "onChange in multiple param mode was given wrong number of values"
        );
      }

      if (focussedField.some(isConfigPathRichTextPart)) {
        // For editor selection we can safely pick a first field name because:
        // * we only can select fields that are children of @easyblocks/rich-text-part
        // * we only can update only single property
        const { templateId } = parsePath(normalizedFieldName[0], form);

        invalidateCache(normalizedFieldName[0], editorContext);

        if (
          templateId === "@easyblocks/rich-text-part" ||
          templateId === "@easyblocks/rich-text-inline-wrapper-element"
        ) {
          let schemaPropNameToUpdate = last(normalizedFieldName[0].split("."));

          if (schemaPropNameToUpdate.startsWith("$")) {
            schemaPropNameToUpdate = schemaPropNameToUpdate.slice(1);
          }

          const canvasIframe = document.getElementById(
            "shopstory-canvas"
          ) as HTMLIFrameElement | null;

          if (canvasIframe === null || canvasIframe.contentWindow === null) {
            throw new Error("No Shopstory canvas");
          }

          if (extraNewValues.length > 0) {
            const parsedValues = (newValue as Array<any>).map((value) =>
              parse(getValue(value), normalizedFieldName[0], field)
            );

            canvasIframe.contentWindow.postMessage(
              richTextChangedEvent({
                prop: schemaPropNameToUpdate,
                schemaProp: field.schemaProp,
                values: parsedValues,
              }),
              "*"
            );
          } else {
            const parsedValue = parse(
              getValue(newValue),
              normalizedFieldName[0],
              field
            );

            canvasIframe.contentWindow.postMessage(
              richTextChangedEvent({
                prop: schemaPropNameToUpdate,
                schemaProp: field.schemaProp,
                values: [parsedValue],
              }),
              "*"
            );
          }

          return;
        }
      }

      actions.runChange(() => {
        normalizedFieldName.forEach((path, fieldIndex) => {
          const inputValue = Array.isArray(newValue)
            ? getValue(newValue[fieldIndex])
            : getValue(newValue);
          let parsedValue = parse(inputValue, path, field);

          // If path has locale token [locale] (component-collection-localised) then we must first replace it with correct token
          if (hasLocaleToken(path)) {
            const currentLocaleFieldName = replaceLocaleToken(
              path,
              contextParams.locale
            );

            const currentLocaleValue = dotNotationGet(
              form.values,
              currentLocaleFieldName
            );

            parsedValue = parse(inputValue, currentLocaleFieldName, field);

            // If the path doesn't exist it means that there is no config for path for current locale. It means we must create it!
            if (currentLocaleValue === undefined) {
              const fallbackLocale = getFallbackLocaleForLocale(
                contextParams.locale,
                locales
              )!;

              const fieldNameSegments = path.split(".");
              const localeTokenIndex = fieldNameSegments.indexOf("[locale]");
              const localisedConfigPath = [
                ...fieldNameSegments.slice(0, localeTokenIndex + 1),
                "0",
              ].join(".");

              const fallbackLocaleFieldName = replaceLocaleToken(
                localisedConfigPath,
                fallbackLocale
              );

              const localeConfigPath = replaceLocaleToken(
                localisedConfigPath,
                contextParams.locale
              );

              form.change(
                localeConfigPath,
                duplicateConfig(
                  dotNotationGet(form.values, fallbackLocaleFieldName),
                  editorContext
                )
              );
            }

            path = currentLocaleFieldName;
          }

          invalidateCache(path, editorContext);

          // At this point we have correct fieldName and correct parsedValue after all [locale] issues solved

          /**
           * Below we're trying to see whether there is a custom change function for specific EditableComponent
           */

          const split = path.split(".");
          const propName = last(split);

          // TODO: here we can have either a component or component field. parsePath should take this into account!
          const componentPath = split.slice(0, split.length - 1).join(".");
          const { templateId } = parsePath(componentPath, editorContext.form);

          const parentDefinition = findComponentDefinitionById(
            templateId,
            editorContext
          )!;
          const config = dotNotationGet(
            editorContext.form.values,
            componentPath
          );

          if (parentDefinition && parentDefinition.change) {
            const values: Record<string, any> = {};
            const closestDefinedValues: Record<string, any> = {};

            parentDefinition.schema.forEach((schemaProp) => {
              const val = config[schemaProp.prop];

              values[schemaProp.prop] = isTrulyResponsiveValue(val)
                ? val[editorContext.breakpointIndex]
                : val;

              closestDefinedValues[schemaProp.prop] =
                responsiveValueGetDefinedValue(
                  val,
                  editorContext.breakpointIndex,
                  editorContext.devices,
                  getDevicesWidths(editorContext.devices)
                );
            });

            const inputValue = isTrulyResponsiveValue(parsedValue)
              ? parsedValue[editorContext.breakpointIndex]
              : parsedValue;

            const result = parentDefinition.change({
              newValue: inputValue,
              prop: propName,
              values,

              /**
               * IMPORTANT!!!
               *
               * valuesAfterAuto are an approximation for now, they're not real auto values, they just have closest defined values.
               *
               */
              valuesAfterAuto: closestDefinedValues,
            }) ?? {
              [propName]: inputValue,
            };

            parentDefinition.schema.forEach((schemaProp) => {
              if (!result.hasOwnProperty(schemaProp.prop)) {
                return;
              }

              let pathPrefix = `${componentPath}.${schemaProp.prop}`;
              if (pathPrefix[0] === ".") {
                pathPrefix = pathPrefix.substring(1);
              }

              if (isTrulyResponsiveValue(config[schemaProp.prop])) {
                form.change(
                  `${pathPrefix}.${editorContext.breakpointIndex}`,
                  result[schemaProp.prop]
                );
              } else {
                form.change(`${pathPrefix}`, result[schemaProp.prop]);
              }
            });
          } else {
            form.change(path, parsedValue);
          }
        });
      });
    },
    getValue() {
      const fieldValues = normalizedFieldName.map((fieldName) => {
        const propName = last(fieldName.split("."));

        if (propName.startsWith("$") && "defaultValue" in field.schemaProp) {
          return field.schemaProp.defaultValue;
        }

        if (hasLocaleToken(fieldName)) {
          const resolvedFieldName = replaceLocaleToken(
            fieldName,
            editorContext.contextParams.locale
          );

          const fieldValue = dotNotationGet(form.values, resolvedFieldName);

          if (fieldValue) {
            return fieldValue;
          }

          const fallbackLocale = getFallbackLocaleForLocale(
            editorContext.contextParams.locale,
            editorContext.locales
          )!;

          const resolvedFieldFallbackName = replaceLocaleToken(
            fieldName,
            fallbackLocale
          );

          const fieldFallbackValue = dotNotationGet(
            form.values,
            resolvedFieldFallbackName
          );

          return fieldFallbackValue;
        }

        return dotNotationGet(form.values, fieldName);
      });

      const uniqueFieldValues = getUniqueValues(fieldValues, (fieldValue) => {
        const { getHash } = getSchemaDefinition(
          field.schemaProp,
          editorContext
        );

        return getHash(
          fieldValue,
          editorContext.breakpointIndex,
          editorContext.devices
        );
      });

      if (uniqueFieldValues.length > 1) {
        return { __mixed__: true };
      }

      return format(uniqueFieldValues[0], normalizedFieldName[0], field);
    },
  };
}

export { createFieldController };

function hasLocaleToken(configPath: string) {
  return configPath.includes("[locale]");
}

function replaceLocaleToken(configPath: string, locale: string) {
  const localisedFieldName = configPath.replace("[locale]", locale);
  return localisedFieldName;
}

function getValue(
  eventOrValue: React.ChangeEvent<HTMLSelectElement | HTMLInputElement> | any
) {
  // Event of course has more properties or methods, but for this case
  // checking only for `currentTarget` is sufficient
  const isEventObject =
    typeof eventOrValue === "object" &&
    eventOrValue !== null &&
    "currentTarget" in eventOrValue;

  if (isEventObject) {
    if (
      "checked" in eventOrValue.currentTarget &&
      eventOrValue.currentTarget.type === "checkbox"
    ) {
      return eventOrValue.currentTarget.checked;
    }

    return eventOrValue.currentTarget.value;
  } else {
    return eventOrValue;
  }
}

type CacheInvalidator = (
  cache: CompilationCache,
  changedPath: string,
  context: EditorContextType
) => Array<string>;

// $richText and @easyblocks/rich-text-part uses a lot of portals to display correct fields within sidebar
// Changing value through portal won't trigger the recompilation of component using that portal.
// When we change any $richText related component we remove cache for that component (if it is $richText)
// and for all of its ancestors.
const richTextCacheInvalidator: CacheInvalidator = (
  cache,
  changedPath,
  context
) => {
  const cacheKeysToRemove: Array<string> = [];
  const { templateId, fieldName, parent } = parsePath(
    changedPath,
    context.form
  );

  const isRichTextOrRichTextAncestorComponent =
    templateId.startsWith("@easyblocks/rich-text") ||
    parent?.templateId.startsWith("@easyblocks/rich-text");

  if (isRichTextOrRichTextAncestorComponent) {
    const richTextPath =
      templateId === "@easyblocks/rich-text" && fieldName
        ? changedPath.replace(`.${fieldName}`, "")
        : findPathOfFirstAncestorOfType(
            changedPath,
            "@easyblocks/rich-text",
            context.form
          );

    const richTextConfig = dotNotationGet(context.form.values, richTextPath);

    traverseComponents(richTextConfig, context, ({ componentConfig }) => {
      if (
        componentConfig &&
        componentConfig._template.startsWith("@easyblocks/rich-text")
      ) {
        cacheKeysToRemove.push(componentConfig._id!);
      }
    });
  }

  return cacheKeysToRemove;
};

// $SectionWrapper holds the hide prop, but the $RootSections component is responsible for showing/hiding sections
// This is done during the compilation of $RootSections so we have to make sure that it's compiled when $SectionWrapper changes.
const sectionWrapperCacheInvalidator: CacheInvalidator = (
  _,
  changedPath,
  context
) => {
  const cacheKeysToRemove: Array<string> = [];

  const { parent } = parsePath(changedPath, context.form);

  if (parent && parent.templateId === "$RootSections") {
    const rootSectionsConfig = dotNotationGet(context.form.values, parent.path);
    cacheKeysToRemove.push(rootSectionsConfig._id);
  }

  return cacheKeysToRemove;
};

const cacheInvalidators: Array<CacheInvalidator> = [
  richTextCacheInvalidator,
  sectionWrapperCacheInvalidator,
];

function invalidateCache(changedPath: string, context: EditorContextType) {
  const cacheKeysToRemove = new Set(
    cacheInvalidators.flatMap((invalidator) => {
      return invalidator(context.compilationCache, changedPath, context);
    })
  );

  cacheKeysToRemove.forEach((cacheKey) => {
    context.compilationCache.remove(cacheKey);
  });
}

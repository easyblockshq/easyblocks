import {
  buildRichTextNoCodeEntry,
  NoCodeComponentEntry,
  InternalTemplate,
  Template,
  UserDefinedTemplate,
  getDefaultLocale,
} from "@easyblocks/core";
import {
  InternalComponentDefinition,
  findComponentDefinitionById,
  normalize,
} from "@easyblocks/core/_internals";
import { uniqueId } from "@easyblocks/utils";
import { EditorContextType } from "../EditorContext";
import { configMap } from "../utils/config/configMap";

function getDefaultTemplateForDefinition(
  def: InternalComponentDefinition,
  editorContext: EditorContextType
): InternalTemplate {
  // Text has different way of building a default config
  const config: NoCodeComponentEntry =
    def.id === "@easyblocks/rich-text"
      ? buildRichTextNoCodeEntry({
          color: getDefaultTokenId(editorContext.theme.colors),
          font: getDefaultTokenId(editorContext.theme.fonts),
        })
      : {
          _component: def.id,
          _id: uniqueId(),
        };

  return {
    id: `${def.id}_default`,
    label: def.label ?? def.id,
    entry: config,
    isUserDefined: false,
  };
}

function getDefaultTokenId(tokens: EditorContextType["theme"][string]) {
  return Object.entries(tokens).find(([, value]) => value.isDefault)?.[0];
}

export async function getTemplates(
  editorContext: EditorContextType,
  configTemplates: InternalTemplate[] = []
): Promise<Template[]> {
  const remoteUserDefinedTemplates: UserDefinedTemplate[] =
    !editorContext.disableCustomTemplates
      ? await editorContext.backend.templates.getAll()
      : [];

  return getTemplatesInternal(
    editorContext,
    configTemplates,
    remoteUserDefinedTemplates
  );
}

function getNecessaryDefaultTemplates(
  components: InternalComponentDefinition[],
  templates: Template[],
  editorContext: EditorContextType
) {
  const result: InternalTemplate[] = [];

  components.forEach((component) => {
    const componentTemplates = templates.filter(
      (template) => template.entry._component === component.id
    );
    if (componentTemplates.length === 0) {
      result.push(getDefaultTemplateForDefinition(component, editorContext));
    }
  });

  return result;
}

function normalizeTextLocales(
  config: NoCodeComponentEntry,
  editorContext: EditorContextType
) {
  return configMap(config, editorContext, ({ value, schemaProp }) => {
    if (schemaProp.type === "text") {
      const firstDefinedValue = Object.values(value.value).filter(
        (x) => x !== null && x !== undefined
      )[0];

      return {
        ...value,
        value: {
          [getDefaultLocale(editorContext.locales).code]: firstDefinedValue,
        },
      };
    } else if (schemaProp.type === "component-collection-localised") {
      const firstDefinedValue = Object.values(value).filter(
        (x) => x !== null && x !== undefined
      )[0];

      return {
        [getDefaultLocale(editorContext.locales).code]: firstDefinedValue,
      };
    }

    return value;
  });
}

function getTemplatesInternal(
  editorContext: EditorContextType,
  configTemplates: InternalTemplate[],
  remoteUserDefinedTemplates: UserDefinedTemplate[]
): Template[] {
  // If a component doesn't have a template, here's one added
  const allBuiltinTemplates = [
    ...configTemplates,
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.components,
      configTemplates,
      editorContext
    ),
  ];

  const allUserTemplates = [
    ...remoteUserDefinedTemplates,
    ...allBuiltinTemplates,
  ];

  const result = allUserTemplates
    .filter((template) => {
      const definition = findComponentDefinitionById(
        template.entry._component,
        editorContext
      );

      if (!definition || definition.hideTemplates) {
        return false;
      }
      return true;
    })
    // .filter((template) => {
    //
    //   const result = template.entry._itemProps
    //     ? Object.keys(template.entry._itemProps).every((componentId) =>
    //       findComponentDefinitionById(componentId, editorContext)
    //     )
    //     : true;
    //
    //   if (template.entry._component === "ProductCard") {
    //     console.log('WOW2222!!!', result);
    //   }
    //
    //   return result;
    // })
    .map((template) => {
      const newTemplate: Template = {
        ...template,
        entry: normalizeTextLocales(
          normalize({ ...template.entry, _itemProps: {} }, editorContext),
          editorContext
        ),
      };

      return newTemplate;
    });

  return result;
}

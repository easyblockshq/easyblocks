import { configMap } from "@easyblocks/app-utils";
import {
  buildRichTextNoCodeEntry,
  ComponentConfig,
  IApiClient,
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
import { getRemoteUserTemplates } from "./getRemoteUserTemplates";

function getDefaultTemplateForDefinition(
  def: InternalComponentDefinition
): InternalTemplate {
  // Text has different way of building a default config
  const config: ComponentConfig =
    def.id === "@easyblocks/rich-text"
      ? buildRichTextNoCodeEntry()
      : {
          _template: def.id,
          _id: uniqueId(),
        };

  return {
    id: `${def.id}_default`,
    label: def.label ?? def.id,
    entry: config,
    isUserDefined: false,
  };
}

export async function getTemplates(
  editorContext: EditorContextType,
  apiClient: IApiClient,
  configTemplates: InternalTemplate[] = []
): Promise<Template[]> {
  let remoteUserDefinedTemplates: UserDefinedTemplate[] = [];

  if (!editorContext.isPlayground && !editorContext.disableCustomTemplates) {
    const project = editorContext.project;
    if (!project) {
      throw new Error(
        "Trying to access templates API without project id. This is an unexpected error state."
      );
    }
    remoteUserDefinedTemplates = await getRemoteUserTemplates(
      apiClient,
      project.id
    );
  }

  return getTemplatesInternal(
    editorContext,
    configTemplates,
    remoteUserDefinedTemplates
  );
}

function getNecessaryDefaultTemplates(
  components: InternalComponentDefinition[],
  templates: Template[]
) {
  const result: InternalTemplate[] = [];

  components.forEach((component) => {
    const componentTemplates = templates.filter(
      (template) => template.entry._template === component.id
    );
    if (componentTemplates.length === 0) {
      result.push(getDefaultTemplateForDefinition(component));
    }
  });

  return result;
}

function normalizeTextLocales(
  config: ComponentConfig,
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

export function getTemplatesInternal(
  editorContext: EditorContextType,
  configTemplates: InternalTemplate[],
  remoteUserDefinedTemplates: UserDefinedTemplate[]
): Template[] {
  // If a component doesn't have a template, here's one added
  const allBuiltinTemplates = [
    ...configTemplates,
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.components,
      configTemplates
    ),
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.textModifiers,
      configTemplates
    ),
  ];

  const allUserTemplates = [
    ...remoteUserDefinedTemplates,
    ...allBuiltinTemplates,
  ];

  const result = allUserTemplates
    .filter((template) => {
      const definition = findComponentDefinitionById(
        template.entry._template,
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
    //   if (template.entry._template === "ProductCard") {
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

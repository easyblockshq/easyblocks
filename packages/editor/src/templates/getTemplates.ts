import { configMap } from "@easyblocks/app-utils";
import {
  ComponentConfig,
  ConfigComponent,
  IApiClient,
  InternalTemplate,
  Template,
  UserDefinedTemplate,
  getDefaultLocale,
} from "@easyblocks/core";
import {
  InternalComponentDefinition,
  buildRichTextNoCodeEntry,
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
    config,
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
    remoteUserDefinedTemplates = await await getRemoteUserTemplates(
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
      (template) => template.config._template === component.id
    );
    if (componentTemplates.length === 0) {
      result.push(getDefaultTemplateForDefinition(component));
    }
  });

  return result;
}

function normalizeTextLocales(
  config: ConfigComponent,
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
      editorContext.definitions.links,
      configTemplates
    ),
    ...getNecessaryDefaultTemplates(
      editorContext.definitions.actions,
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
        template.config._template,
        editorContext
      );
      if (!definition || definition.hideTemplates) {
        return false;
      }
      return true;
    })
    .filter((template) => {
      return template.config._itemProps
        ? Object.keys(template.config._itemProps).every((componentId) =>
            findComponentDefinitionById(componentId, editorContext)
          )
        : true;
    })
    .map((template) => {
      return {
        ...template,
        config: normalizeTextLocales(
          normalize(template.config, editorContext),
          editorContext
        ),
      };
    });

  return result;
}

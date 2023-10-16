import { SSBasicRow, SSModal } from "@easyblocks/design-system";
import React, { ChangeEvent, useState } from "react";
import { useEditorContext } from "./EditorContext";
import { Template } from "./types";
import { TemplatePicker, TemplatesDictionary } from "./TemplatePicker";
import { ComponentDefinitionShared } from "@easyblocks/core";

function checkQueryForTemplate(
  query: string,
  template: Template,
  component: ComponentDefinitionShared
) {
  return `${template.label ?? ""}${component.label ?? component.id}`
    .toLocaleLowerCase()
    .includes(query.trim().toLocaleLowerCase());
}

export const SearchableSmallPickerModal: TemplatePicker = ({
  onClose,
  templates,
  isOpen,
}) => {
  const editorContext = useEditorContext();

  const templatesDict = templates;

  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLocaleLowerCase();

  const filteredTemplatesDict: TemplatesDictionary = {};

  if (templatesDict) {
    Object.values(templatesDict).forEach(({ templates, component }) => {
      const filteredTemplates =
        trimmedQuery === ""
          ? templates
          : templates.filter((template) =>
              checkQueryForTemplate(trimmedQuery, template, component)
            );

      if (filteredTemplates.length > 0) {
        filteredTemplatesDict[component.id] = {
          component,
          templates: filteredTemplates,
        };
      }
    });
  }

  const close = (template?: Template) => {
    setQuery("");

    if (!template) {
      onClose();
    } else {
      onClose(template);
    }
  };

  return (
    <SSModal
      mode={"center-small"}
      isOpen={isOpen}
      onRequestClose={() => {
        close(undefined);
      }}
      noPadding={true}
      headerLine={true}
      searchProps={{
        value: query,
        placeholder: "Search...",
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
        },
      }}
      headerSymbol={"S"}
    >
      {templatesDict === undefined && "Loading..."}
      {templatesDict !== undefined &&
        Object.entries(filteredTemplatesDict).map(
          ([, { templates, component }]) => {
            const isOnlyOne = templates.length === 1;
            const componentLabel = component.label ?? component.id;

            return templates.map((template) => {
              const templateLabel = template.label ?? template.id;

              const title = isOnlyOne ? componentLabel : templateLabel;
              const thumbnail = template.thumbnail ?? component.thumbnail;
              const description = isOnlyOne ? undefined : componentLabel;

              return (
                <SSBasicRow
                  key={template.id!}
                  title={title}
                  description={description}
                  onClick={() => {
                    close(template);
                  }}
                  image={thumbnail}
                  tinyDescription={true}
                  onEdit={
                    template.isUserDefined
                      ? () => {
                          editorContext.actions.openTemplateModal({
                            mode: "edit",
                            template: template as Template,
                          });
                        }
                      : undefined
                  }
                />
              );
            });
          }
        )}
    </SSModal>
  );
};

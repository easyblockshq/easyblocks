import { SSBasicRow, SSModal } from "@easyblocks/design-system";
import React, { ChangeEvent, useState } from "react";
import { useEditorContext } from "./EditorContext";
import { Template } from "./types";
import { TemplatePicker } from "./TemplatePicker";

export const SearchableSmallPickerModal: TemplatePicker = ({
  onClose,
  templates,
  isOpen,
}) => {
  const editorContext = useEditorContext();

  const templatesDict = templates;
  // const filteredTemplates = templates
  //   ? Object.entries(templates).map(
  //       ([componentId, { component, templates }]) => {
  //         return templates[0];
  //       }
  //     )
  //   : [];
  //
  // console.log("@@@", filteredTemplates);

  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();

  // const filteredTemplates =
  //   trimmedQuery === ""
  //     ? templates
  //     : templates.filter((template) => {
  //         return (
  //           (template.type || "").toLocaleLowerCase().includes(trimmedQuery) ||
  //           (template.label || "").toLocaleLowerCase().includes(trimmedQuery) ||
  //           (isTemplate(template) ? template.config._template || "" : "")
  //             .toLocaleLowerCase()
  //             .includes(trimmedQuery)
  //         );
  //       });

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
        Object.entries(templatesDict).map(([, { templates, component }]) => {
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
        })}
    </SSModal>
  );
};

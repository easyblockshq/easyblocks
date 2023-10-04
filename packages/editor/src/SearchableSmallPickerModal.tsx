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

  const filteredTemplates = templates
    ? Object.entries(templates).map(
        ([componentId, { component, templates }]) => {
          return templates[0];
        }
      )
    : [];

  console.log("@@@", filteredTemplates);

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
      {filteredTemplates.map((template) => {
        // const hasTemplateLabel = !!template.label;
        // const componentName =
        //   template.type ??
        //   getComponentLabelFromTemplate(template, editorContext);
        // const isCustom =
        //   isTemplate(template) && !template.config._template.startsWith("$");

        return (
          <SSBasicRow
            key={template.id!}
            title={template.label ?? template.config._template}
            // description={hasTemplateLabel ? componentName : undefined}
            onClick={() => {
              close(template);
            }}
            image={template.thumbnail}
            // customTitle={isCustom && !hasTemplateLabel}
            // customDescription={isCustom && hasTemplateLabel}
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
      })}
    </SSModal>
  );
};

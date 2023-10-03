import { AnyTemplate, isTemplate } from "@easyblocks/app-utils";
import { SSBasicRow, SSModal } from "@easyblocks/design-system";
import React, { ChangeEvent, useState } from "react";
import { useEditorContext } from "./EditorContext";
import { getComponentLabelFromTemplate } from "./utils/getComponentLabelFromTemplate";
import { Template } from "./types";

type SearchableSmallPickerModal = {
  isOpen: boolean;
  componentTypes: string[];
  onClose: (template?: AnyTemplate) => void;
};

export const SearchableSmallPickerModal: React.FC<
  SearchableSmallPickerModal
> = (props) => {
  const editorContext = useEditorContext();
  const templates = editorContext.templates?.[props.componentTypes[0]] ?? [];

  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim().toLocaleLowerCase();

  const filteredTemplates =
    trimmedQuery === ""
      ? templates
      : templates.filter((template) => {
          return (
            (template.type || "").toLocaleLowerCase().includes(trimmedQuery) ||
            (template.label || "").toLocaleLowerCase().includes(trimmedQuery) ||
            (isTemplate(template) ? template.config._template || "" : "")
              .toLocaleLowerCase()
              .includes(trimmedQuery)
          );
        });

  const close = (template?: AnyTemplate) => {
    setQuery("");
    props.onClose(template);
  };

  return (
    <SSModal
      mode={"center-small"}
      isOpen={props.isOpen}
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
        const hasTemplateLabel = !!template.label;
        const componentName =
          template.type ??
          getComponentLabelFromTemplate(template, editorContext);
        const isCustom =
          isTemplate(template) && !template.config._template.startsWith("$");

        return (
          <SSBasicRow
            key={template.id!}
            title={hasTemplateLabel ? template.label! : componentName}
            description={hasTemplateLabel ? componentName : undefined}
            onClick={() => {
              close(template);
            }}
            image={template.previewImage}
            customTitle={isCustom && !hasTemplateLabel}
            customDescription={isCustom && hasTemplateLabel}
            tinyDescription={true}
            onEdit={
              isTemplate(template) && template.isRemoteUserDefined
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

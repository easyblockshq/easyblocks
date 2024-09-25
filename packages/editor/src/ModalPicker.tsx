import React, { useCallback, useMemo, memo } from "react";
import {
  NoCodeComponentEntry,
  ComponentSchemaProp,
  Template,
} from "@easyblocks/core";
import {
  duplicateConfig,
  findComponentDefinition,
  normalize,
} from "@easyblocks/core/_internals";
import { dotNotationGet } from "@easyblocks/utils";

import { useEditorContext } from "./EditorContext";
// import { SearchableSmallPickerModal } from "./SearchableSmallPickerModal";
// import { SectionPickerModal } from "./SectionPicker";
import { TemplatePicker, TemplatesDictionary } from "./TemplatePicker";
import { OpenComponentPickerConfig } from "./types";
import { unrollAcceptsFieldIntoComponents } from "./unrollAcceptsFieldIntoComponents";

interface ModalProps {
  config: OpenComponentPickerConfig;
  onClose: (config?: NoCodeComponentEntry) => void;
  pickers?: Record<string, TemplatePicker>;
}

export const ModalPicker = memo(({ config, onClose, pickers }: ModalProps) => {
  const editorContext = useEditorContext();
  const { form } = editorContext;

  const [fieldName, parentPath] = useMemo(() => {
    const split = config.path.split("."); // TODO: right now only for collections
    const parentPath = split.slice(0, split.length - 1).join(".");
    const fieldName = split[split.length - 1];

    return [fieldName, parentPath];
  }, [config.path]);

  const parentData: NoCodeComponentEntry = useMemo(
    () => dotNotationGet(form.values, parentPath),
    [form.values, parentPath]
  );

  const schemaProp = useMemo(
    () =>
      findComponentDefinition(parentData, editorContext)?.schema.find(
        (x) => x.prop === fieldName
      ) as ComponentSchemaProp,
    [editorContext, fieldName, parentData]
  );

  const componentTypes = config.componentTypes ?? schemaProp.accepts;

  const templatesDictionary = useMemo(() => {
    const components = unrollAcceptsFieldIntoComponents(
      componentTypes,
      editorContext
    );

    let templatesDictionary: TemplatesDictionary | undefined = undefined;

    if (editorContext.templates) {
      templatesDictionary = {};

      for (const component of components) {
        templatesDictionary[component.id] = {
          component,
          templates: [],
        };

        for (const template of editorContext.templates) {
          if (component.id === template.entry._component) {
            templatesDictionary[component.id].templates.push(template);
          }
        }

        if (templatesDictionary[component.id].templates.length === 0) {
          delete templatesDictionary[component.id];
        }
      }
    }

    return templatesDictionary;
  }, [componentTypes, editorContext]);

  const picker = schemaProp.picker ?? "compact";

  // const defaultPickerMode =
  //   accepts.includes("section") || componentTypes.includes("card")
  //     ? "big"
  //     : "small";
  //
  // const pickerMode = schemaProp.picker || defaultPickerMode;

  const onModalClose = useCallback(
    (template?: Template) => {
      function close(config: NoCodeComponentEntry) {
        const _itemProps = {
          [parentData._component]: {
            [fieldName]: {},
          },
        };

        const newComponent = fieldName.startsWith("$")
          ? config
          : duplicateConfig(
              normalize(
                {
                  ...config,
                  _itemProps,
                },
                editorContext
              ),
              editorContext
            );

        onClose(newComponent);
      }

      if (template) {
        close(normalize(template.entry, editorContext));
      } else {
        onClose();
      }
    },
    [editorContext, fieldName, onClose, parentData._component]
  );

  return pickers?.[picker] ? (
    pickers[picker]({
      isOpen: true,
      onClose: onModalClose,
      templates: templatesDictionary,
      mode: picker,
    })
  ) : (
    <div>Unknown picker: {picker}</div>
  );
});

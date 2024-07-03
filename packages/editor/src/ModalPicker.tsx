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
import React, { FC } from "react";
import { useEditorContext } from "./EditorContext";
import { SearchableSmallPickerModal } from "./SearchableSmallPickerModal";
import { SectionPickerModal } from "./SectionPicker";
import { TemplatePicker, TemplatesDictionary } from "./TemplatePicker";
import { OpenComponentPickerConfig } from "./types";
import { unrollAcceptsFieldIntoComponents } from "./unrollAcceptsFieldIntoComponents";

type ModalProps = {
  config: OpenComponentPickerConfig;
  onClose: (config?: NoCodeComponentEntry) => void;
  pickers?: Record<string, TemplatePicker>;
};

export const ModalPicker: FC<ModalProps> = ({ config, onClose, pickers }) => {
  const editorContext = useEditorContext();
  const { form } = editorContext;

  const split = config.path.split("."); // TODO: right now only for collections
  const parentPath = split.slice(0, split.length - 1).join(".");
  const fieldName = split[split.length - 1];

  const parentData: NoCodeComponentEntry = dotNotationGet(
    form.values,
    parentPath
  );
  const schemaProp = findComponentDefinition(
    parentData,
    editorContext
  )!.schema.find((x) => x.prop === fieldName) as ComponentSchemaProp;

  const componentTypes = config.componentTypes ?? schemaProp.accepts;
  const components = unrollAcceptsFieldIntoComponents(
    componentTypes,
    editorContext
  );

  let templatesDictionary: TemplatesDictionary | undefined = undefined;

  if (editorContext.templates) {
    templatesDictionary = {};

    components.forEach((component) => {
      templatesDictionary![component.id] = {
        component,
        templates: [],
      };

      editorContext.templates!.forEach((template) => {
        if (component.id === template.entry._component) {
          templatesDictionary![component.id].templates.push(template);
        }
      });

      if (templatesDictionary![component.id].templates.length === 0) {
        delete templatesDictionary![component.id];
      }
    });
  }

  const picker = schemaProp.picker ?? "compact";

  // const defaultPickerMode =
  //   accepts.includes("section") || componentTypes.includes("card")
  //     ? "big"
  //     : "small";
  //
  // const pickerMode = schemaProp.picker || defaultPickerMode;

  const close = (config: NoCodeComponentEntry) => {
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
  };

  const onModalClose = (template?: Template) => {
    if (template) {
      close(normalize(template.entry, editorContext));
    } else {
      onClose();
    }
  };

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
};

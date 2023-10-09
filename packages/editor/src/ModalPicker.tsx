import {
  AnyTemplate,
  duplicateConfig,
  findComponentDefinition,
  isSpecialTemplate,
} from "@easyblocks/app-utils";
import { normalize } from "@easyblocks/compiler";
import {
  ComponentSchemaProp,
  ConfigComponent,
  isNoCodeComponentOfType,
  Template,
} from "@easyblocks/core";
import {
  optionalTextModifierSchemaProp,
  richTextInlineWrapperActionSchemaProp,
  richTextPartEditableComponent,
} from "@easyblocks/editable-components";
import { dotNotationGet } from "@easyblocks/utils";
import React, { FC } from "react";
import { useEditorContext } from "./EditorContext";
import { SearchableSmallPickerModal } from "./SearchableSmallPickerModal";
import { SectionPickerModal } from "./SectionPicker";
import { OpenComponentPickerConfig } from "./types";
import { unrollAcceptsFieldIntoComponentIds } from "./unrollAcceptsFieldIntoComponentIds";
import { TemplatesDictionary } from "./TemplatePicker";
import { unrollAcceptsFieldIntoComponents } from "./unrollAcceptsFieldIntoComponents";

type ModalProps = {
  config: OpenComponentPickerConfig;
  onClose: (config?: ConfigComponent) => void;
};

export const ModalPicker: FC<ModalProps> = ({ config, onClose }) => {
  const editorContext = useEditorContext();
  const { form } = editorContext;

  let modal: any;

  const split = config.path.split("."); // TODO: right now only for collections
  const parentPath = split.slice(0, split.length - 1).join(".");
  const fieldName = split[split.length - 1];

  const parentData: ConfigComponent = dotNotationGet(form.values, parentPath);
  let schemaProp = findComponentDefinition(
    parentData,
    editorContext
  )!.schema.find((x) => x.prop === fieldName) as ComponentSchemaProp;

  if (
    !schemaProp &&
    parentData._template === richTextPartEditableComponent.id
  ) {
    if (fieldName === "$action") {
      schemaProp = richTextInlineWrapperActionSchemaProp;
    }

    if (fieldName === "$textModifier") {
      schemaProp = optionalTextModifierSchemaProp;
    }
  }

  const componentTypes = config.componentTypes ?? schemaProp.componentTypes;
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
        if (component.id === template.config._template) {
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
  //   componentTypes.includes("section") || componentTypes.includes("card")
  //     ? "big"
  //     : "small";
  //
  // const pickerMode = schemaProp.picker || defaultPickerMode;

  const close = (config: ConfigComponent) => {
    const _itemProps = {
      [parentData._template]: {
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
      close(normalize(template.config, editorContext));
    } else {
      onClose();
    }
  };

  if (picker === "large" || picker === "large-3") {
    return (
      <SectionPickerModal
        isOpen={true}
        onClose={onModalClose}
        templates={templatesDictionary}
        mode={picker}
      />
    );
  } else if (picker === "compact") {
    console.log("COMPACT!!!!!", templatesDictionary);

    return (
      <SearchableSmallPickerModal
        isOpen={true}
        onClose={onModalClose}
        templates={templatesDictionary}
      />
    );
  } else {
    throw new Error(`unknown template picker: "${picker}"`);
  }

  // if (pickerMode === "small") {
  //   modal = (
  //     <SearchableSmallPickerModal
  //       isOpen={true}
  //       onClose={onModalClose}
  //       componentTypes={componentTypes}
  //     />
  //   );
  // } else {
  //   modal = (
  //     <SectionPickerModal
  //       isOpen={true}
  //       onSelect={onModalClose}
  //       onClose={onClose}
  //       componentTypes={componentTypes}
  //     />
  //   );
  // }

  // return modal;
};

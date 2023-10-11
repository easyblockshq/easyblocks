import { ComponentDefinitionShared, Template } from "@easyblocks/core";

export type TemplatesDictionary = {
  [componentId: string]: {
    component: ComponentDefinitionShared;
    templates: Template[];
  };
};

export type TemplatePickerProps = {
  isOpen: boolean;
  templates?: TemplatesDictionary;
  onClose: (template?: Template) => void;
};

export type TemplatePicker<T = Record<never, never>> = React.FC<
  TemplatePickerProps & T
>;

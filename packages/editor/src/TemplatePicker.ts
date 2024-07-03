import { ComponentDefinitionShared, Template } from "@easyblocks/core";

export type TemplatesDictionary = {
  [componentId: string]: {
    component: ComponentDefinitionShared;
    templates: Template[];
  };
};

type TemplatePickerProps = {
  isOpen: boolean;
  templates?: TemplatesDictionary;
  onClose: (template?: Template) => void;
  mode?: string;
};

export type TemplatePicker<T = Record<never, never>> = React.FC<
  TemplatePickerProps & T
>;

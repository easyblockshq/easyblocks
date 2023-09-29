import { Template } from "@easyblocks/core";

export type TemplatesDictionary = {
  [componentId: string]: Template[];
};

export type TemplatePickerProps = {
  isOpen: boolean;
  templates?: TemplatesDictionary;
  onClose: (template?: Template) => void;
};

export type TemplatePicker = React.FC<TemplatePickerProps>;

import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import {
  ComponentConfig,
  NoCodeComponentEditingFunctionInput,
  NoCodeComponentEditingFunctionResult,
} from "../../../types";
import { EditorContextType } from "../../types";

export interface Text {
  text: string;
  id: string;
  isHighlighted?: boolean;
  highlightType?: "text" | "action";
  color: Record<string, any>;
  font: Record<string, any>;
  action: [ComponentConfig] | [];
  actionTextModifier: [ComponentConfig] | [];
}

export interface ParagraphElement {
  id: string;
  type: "paragraph";
  children: Array<TextLineElement>;
}

export interface TextLineElement {
  id: string;
  type: "text-line";
  children: Array<Text>;
}

export interface BulletedList {
  id: string;
  type: "bulleted-list";
  children: Array<ListItemElement>;
}

export interface NumberedList {
  id: string;
  type: "numbered-list";
  children: Array<ListItemElement>;
}

export interface ListItemElement {
  id: string;
  type: "list-item";
  children: Array<Text>;
}
export type BlockElement = BulletedList | NumberedList | ParagraphElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element:
      | BulletedList
      | ListItemElement
      | NumberedList
      | ParagraphElement
      | TextLineElement;
    Text: Text;
  }
}

export type RichTextEditingFunction = (
  input: NoCodeComponentEditingFunctionInput & {
    __SECRET_INTERNALS__?: {
      pathPrefix: string;
      editorContext: EditorContextType;
    };
  }
) => NoCodeComponentEditingFunctionResult;

export type Alignment = "center" | "left" | "right";

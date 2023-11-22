import { EditorContextType } from "@easyblocks/app-utils";
import {
  ConfigComponent,
  NoCodeComponentEditingFunctionResult,
  NoCodeComponentEditingFunctionInput,
} from "@easyblocks/core";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export interface Text {
  text: string;
  id: string;
  isHighlighted?: boolean;
  highlightType?: "text" | "wrapper";
  color: Record<string, any>;
  font: Record<string, any>;
}

export interface ParagraphElement {
  id: string;
  type: "paragraph";
  children: Array<TextLineElement>;
}

export interface TextLineElement {
  id: string;
  type: "text-line";
  children: Array<Text | InlineWrapperElement>;
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
  children: Array<Text | InlineWrapperElement>;
}

export interface InlineWrapperElement {
  id: string;
  type: "inline-wrapper";
  children: Array<Text>;
  action: [ConfigComponent] | [];
  textModifier: [ConfigComponent] | [];
  actionTextModifier: [ConfigComponent] | [];
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
      | TextLineElement
      | InlineWrapperElement;
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

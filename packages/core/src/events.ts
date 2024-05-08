import { serialize } from "@easyblocks/utils";
import { ConfigDevices, NoCodeComponentEntry, SchemaProp } from "./types";
import { Component$$$SchemaProp } from "./compiler/schema";

type EasyblocksEditorEventData<
  Type extends `@easyblocks-editor/${string}${string}`,
  Payload = never
> = Payload extends never ? { type: Type } : { type: Type; payload: Payload };

type InferShopstoryEditorEventData<Event> = Event extends MessageEvent<
  EasyblocksEditorEventData<infer Type, infer Payload>
>
  ? EasyblocksEditorEventData<Type, Payload>
  : never;

type SelectionFramePositionChangedEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/selection-frame-position-changed",
    {
      target: DOMRect;
      container?: DOMRect;
    }
  >
>;

function selectionFramePositionChanged(
  target: DOMRect,
  container?: DOMRect
): InferShopstoryEditorEventData<SelectionFramePositionChangedEvent> {
  return {
    type: "@easyblocks-editor/selection-frame-position-changed",
    payload: {
      target,
      container,
    },
  };
}

type RichTextChangedEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/rich-text-changed",
    {
      prop: "font" | "color" | "TextWrapper";
      schemaProp: SchemaProp | Component$$$SchemaProp;
      values: Array<Record<string, any> | [] | [NoCodeComponentEntry]>;
    }
  >
>;

function richTextChangedEvent(
  payload: InferShopstoryEditorEventData<RichTextChangedEvent>["payload"]
): InferShopstoryEditorEventData<RichTextChangedEvent> {
  return {
    type: "@easyblocks-editor/rich-text-changed",
    payload: serialize(payload),
  };
}

type ComponentPickerOpenedEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/component-picker-opened",
    { path: string }
  >
>;

function componentPickerOpened(
  path: string
): InferShopstoryEditorEventData<ComponentPickerOpenedEvent> {
  return {
    type: "@easyblocks-editor/component-picker-opened",
    payload: {
      path,
    },
  };
}

type ComponentPickerClosedEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/component-picker-closed",
    { config?: NoCodeComponentEntry }
  >
>;

function componentPickerClosed(
  config?: NoCodeComponentEntry
): InferShopstoryEditorEventData<ComponentPickerClosedEvent> {
  return {
    type: "@easyblocks-editor/component-picker-closed",
    payload: {
      config,
    },
  };
}

type ItemInsertedEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/item-inserted",
    { name: string; index: number; block: NoCodeComponentEntry }
  >
>;

function itemInserted(
  payload: InferShopstoryEditorEventData<ItemInsertedEvent>["payload"]
): InferShopstoryEditorEventData<ItemInsertedEvent> {
  return {
    type: "@easyblocks-editor/item-inserted",
    payload,
  };
}

type ItemMovedEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/item-moved",
    {
      fromPath: string;
      toPath: string;
      placement?: "before" | "after";
    }
  >
>;

type ChangeResponsiveEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/change-responsive",
    {
      device: keyof ConfigDevices;
    }
  >
>;

type UndoEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/undo",
    {
      type: "@easyblocks-editor/undo";
    }
  >
>;

type CanvasLoadedEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/canvas-loaded",
    {
      type: "@easyblocks-editor/canvas-loaded";
    }
  >
>;

type RemoveItemsEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/remove-items",
    {
      type: "@easyblocks-editor/remove-items";
      paths: Array<string>;
    }
  >
>;

type PasteItemsEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/paste-items",
    {
      type: "@easyblocks-editor/paste-items";
      configs: any;
    }
  >
>;

type MoveItemsEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/move-items",
    {
      type: "@easyblocks-editor/move-items";
      paths: Array<string>;
      direction: "top" | "right" | "bottom" | "left";
    }
  >
>;

type LogSelectedEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/log-selected-items",
    {
      type: "@easyblocks-editor/log-selected-items";
    }
  >
>;

type FormChangeEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/form-change",
    {
      key: string;
      value: any;
      focussedField?: Array<string> | string;
    }
  >
>;

type RedoEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/redo",
    {
      type: "@easyblocks-editor/redo";
    }
  >
>;

type SetFocussedFieldEvent = MessageEvent<
  EasyblocksEditorEventData<
    "@easyblocks-editor/focus",
    {
      target: Array<string> | string;
    }
  >
>;

function itemMoved(
  payload: InferShopstoryEditorEventData<ItemMovedEvent>["payload"]
): InferShopstoryEditorEventData<ItemMovedEvent> {
  return {
    type: "@easyblocks-editor/item-moved",
    payload,
  };
}

export {
  componentPickerClosed,
  componentPickerOpened,
  itemInserted,
  itemMoved,
  richTextChangedEvent,
  selectionFramePositionChanged,
};
export type {
  ComponentPickerClosedEvent,
  ComponentPickerOpenedEvent,
  InferShopstoryEditorEventData,
  ItemInsertedEvent,
  ItemMovedEvent,
  RichTextChangedEvent,
  SelectionFramePositionChangedEvent,
  EasyblocksEditorEventData,
  ChangeResponsiveEvent,
  UndoEvent,
  RedoEvent,
  SetFocussedFieldEvent,
  FormChangeEvent,
  CanvasLoadedEvent,
  RemoveItemsEvent,
  PasteItemsEvent,
  MoveItemsEvent,
  LogSelectedEvent,
};

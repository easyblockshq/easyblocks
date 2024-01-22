import { serialize } from "@easyblocks/utils";
import { ComponentConfig, SchemaProp } from "./types";
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
      prop: string;
      schemaProp: SchemaProp | Component$$$SchemaProp;
      values: Array<unknown>;
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
    { config?: ComponentConfig }
  >
>;

function componentPickerClosed(
  config?: ComponentConfig
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
    { name: string; index: number; block: ComponentConfig }
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
};

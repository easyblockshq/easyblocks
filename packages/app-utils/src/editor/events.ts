import type { ComponentConfig, SchemaProp } from "@easyblocks/core";
import { Component$$$SchemaProp } from "@easyblocks/core/_internals";
import { serialize } from "@easyblocks/utils";

type ShopstoryEditorEventData<
  Type extends `@shopstory-editor/${string}${string}`,
  Payload = never
> = Payload extends never ? { type: Type } : { type: Type; payload: Payload };

type InferShopstoryEditorEventData<Event> = Event extends MessageEvent<
  ShopstoryEditorEventData<infer Type, infer Payload>
>
  ? ShopstoryEditorEventData<Type, Payload>
  : never;

type SelectionFramePositionChangedEvent = MessageEvent<
  ShopstoryEditorEventData<
    "@shopstory-editor/selection-frame-position-changed",
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
    type: "@shopstory-editor/selection-frame-position-changed",
    payload: {
      target,
      container,
    },
  };
}

type RichTextChangedEvent = MessageEvent<
  ShopstoryEditorEventData<
    "@shopstory-editor/rich-text-changed",
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
    type: "@shopstory-editor/rich-text-changed",
    payload: serialize(payload),
  };
}

type ComponentPickerOpenedEvent = MessageEvent<
  ShopstoryEditorEventData<
    "@shopstory-editor/component-picker-opened",
    { path: string }
  >
>;

function componentPickerOpened(
  path: string
): InferShopstoryEditorEventData<ComponentPickerOpenedEvent> {
  return {
    type: "@shopstory-editor/component-picker-opened",
    payload: {
      path,
    },
  };
}

type ComponentPickerClosedEvent = MessageEvent<
  ShopstoryEditorEventData<
    "@shopstory-editor/component-picker-closed",
    { config?: ComponentConfig }
  >
>;

function componentPickerClosed(
  config?: ComponentConfig
): InferShopstoryEditorEventData<ComponentPickerClosedEvent> {
  return {
    type: "@shopstory-editor/component-picker-closed",
    payload: {
      config,
    },
  };
}

type ItemInsertedEvent = MessageEvent<
  ShopstoryEditorEventData<
    "@shopstory-editor/item-inserted",
    { name: string; index: number; block: ComponentConfig }
  >
>;

function itemInserted(
  payload: InferShopstoryEditorEventData<ItemInsertedEvent>["payload"]
): InferShopstoryEditorEventData<ItemInsertedEvent> {
  return {
    type: "@shopstory-editor/item-inserted",
    payload,
  };
}

type ItemMovedEvent = MessageEvent<
  ShopstoryEditorEventData<
    "@shopstory-editor/item-moved",
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
    type: "@shopstory-editor/item-moved",
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
  ShopstoryEditorEventData,
};

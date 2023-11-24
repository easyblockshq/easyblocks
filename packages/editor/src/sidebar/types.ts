import type { Widget, WidgetComponentProps } from "@easyblocks/core";
import type { ComponentType } from "react";

export type EditorWidget = Widget & {
  component: ComponentType<WidgetComponentProps>;
};

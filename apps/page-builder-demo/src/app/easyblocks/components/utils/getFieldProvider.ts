import { EditingInfo } from "@easyblocks/core";

export const getFieldProvider = (editingInfo: EditingInfo) => (path: string) =>
  editingInfo.fields.find((field) => field.path === path)!;

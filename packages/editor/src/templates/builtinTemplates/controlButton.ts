import { buildText } from "../../types/text/buildText";
import { EditorContextType } from "../../EditorContext";
import { ComponentConfig } from "@easyblocks/core";
import { uniqueId } from "@easyblocks/utils";

export const controlButton = (
  editorContext: EditorContextType,
  symbol: any,
  label: string,
  buttonSize: number,
  symbolSize: number,
  backgroundColor: string
): ComponentConfig => ({
  _template: "$IconButton2",
  _id: uniqueId(),
  symbol: [symbol],
  label: buildText(label, editorContext),
  buttonSize: {
    $res: true,
    [editorContext.mainBreakpointIndex]: buttonSize.toString(),
  },
  symbolSize: {
    $res: true,
    [editorContext.mainBreakpointIndex]: symbolSize.toString(),
  },
  backgroundColor: {
    $res: true,
    [editorContext.mainBreakpointIndex]: {
      value: backgroundColor,
    },
  },
});

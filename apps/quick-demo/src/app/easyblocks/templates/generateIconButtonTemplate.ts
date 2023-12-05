import { buildText } from "@easyblocks/core/_internals";
import { EditorContextType } from "@easyblocks/editor";

export const generateIconButtonTemplate = (
  editorContext: EditorContextType,
  symbol: any,
  label: string,
  buttonSize: number,
  symbolSize: number,
  backgroundColor: string
) => ({
  _template: "$IconButton2",
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

import { EasyblocksEditorProps } from "../EasyblocksEditorProps";
import { debugTypes } from "./debugTypes";
import { debugSectionDefinition } from "./DebugSection/DebugSection.definition";
import { debugTokens } from "./debugTokens";
import { DebugSection } from "./DebugSection/DebugSection";
import { DebugUrlWidget } from "./DebugUrlWidget";

export function addDebugToEditorProps(
  props: EasyblocksEditorProps
): EasyblocksEditorProps {
  return {
    ...props,
    config: {
      ...props.config,
      types: {
        ...props.config.types,
        ...debugTypes,
      },
      components: [...(props.config.components ?? []), debugSectionDefinition],
      tokens: {
        ...props.config.tokens,
        ...debugTokens,
      },
    },
    components: {
      ...props.components,
      DebugSection,
    },
    widgets: {
      ...props.widgets,
      debug_url: DebugUrlWidget,
    },
  };
}

import {
  CompilationContextType,
  findComponentDefinitionById,
  InternalTextModifierDefinition,
} from "@easyblocks/app-utils";
import { CompiledTextModifier } from "@easyblocks/core";

export function getTextModifierStyles(
  modifier: [CompiledTextModifier] | [],
  compilationContext: CompilationContextType
) {
  let modifierStyles: Record<string, unknown> = {};
  let childStyles: Record<string, unknown> | undefined;

  if (modifier.length === 1) {
    const modifierDefinition = findComponentDefinitionById(
      modifier[0]._template,
      compilationContext
    ) as InternalTextModifierDefinition | undefined;

    if (modifierDefinition) {
      modifierStyles = modifierDefinition.apply(modifier[0]);
      childStyles = modifierDefinition.childApply?.(modifier[0]);
    }
  }

  return {
    modifierStyles,
    childStyles,
  };
}

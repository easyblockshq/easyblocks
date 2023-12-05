import { CompilationContextType } from "@easyblocks/core/_internals";
import { normalize } from "@easyblocks/core/_internals";
import { ConfigComponent } from "@easyblocks/core";

export function reconcile({
  context,
  templateId,
  fieldName,
}: {
  context: CompilationContextType;
  templateId?: string;
  fieldName?: string;
}) {
  return (item: ConfigComponent) => {
    if (!fieldName || !templateId) {
      return item;
    }

    const contextMatches =
      item._itemProps?.[templateId]?.[fieldName] !== undefined;

    if (contextMatches) {
      return item;
    }

    return normalize(
      {
        ...item,
        _itemProps: {
          [templateId]: {
            [fieldName]: {},
          },
        },
      },
      context
    );
  };
}

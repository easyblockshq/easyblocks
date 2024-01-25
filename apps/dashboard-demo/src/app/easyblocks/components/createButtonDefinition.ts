import { NoCodeComponentDefinition } from "@easyblocks/core";

/**
 * This is a generic wrapper that always adds Action property to the button
 */
export function createButtonDefinition(
  componentDefinition: NoCodeComponentDefinition
): NoCodeComponentDefinition {
  return {
    ...componentDefinition,
    schema: [
      ...componentDefinition.schema,
      {
        prop: "Action",
        label: "Action",
        type: "component",
        accepts: ["action"],
        visible: true,
        noInline: true,
      },
    ],
  };
}

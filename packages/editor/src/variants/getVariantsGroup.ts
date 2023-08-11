import { ConfigComponent } from "@easyblocks/core";
import { VariantsRepository } from "../types";

function getVariantsGroup(
  repository?: VariantsRepository,
  groupId?: string
): ConfigComponent[] {
  if (!groupId) {
    return [];
  }

  const variants = repository?.[groupId] ?? [];

  return variants;
}

export { getVariantsGroup };

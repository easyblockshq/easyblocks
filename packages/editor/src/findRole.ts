import { ComponentSchemaProp, SchemaProp } from "@easyblocks/core";
import { AnyRole } from "./types";
import { roles } from "./roles";

export function findRoleFromSchemaProp(
  schemaProp: SchemaProp
): undefined | string {
  return (schemaProp as ComponentSchemaProp).accepts[0];
}

export function findRolesInTags(tags: string[]): AnyRole[] {
  const resultRoles: AnyRole[] = [];

  if (tags.includes("section")) {
    resultRoles.push(roles.section);
  } else if (tags.includes("card")) {
    resultRoles.push(roles.card);
  } else if (tags.includes("background")) {
    resultRoles.push(roles.background);
  } else if (tags.includes("symbol")) {
    resultRoles.push(roles.symbol);
  } else if (tags.includes("button")) {
    resultRoles.push(roles.button);
  } else if (tags.includes("actionTextModifier")) {
    resultRoles.push(roles.actionTextModifier);
  } else if (tags.includes("action")) {
    resultRoles.push(roles.action);
  } else if (tags.includes("actionLink")) {
    resultRoles.push(roles.actionLink);
  } else if (tags.includes("item")) {
    resultRoles.push(roles.item);
  }

  return resultRoles;
}

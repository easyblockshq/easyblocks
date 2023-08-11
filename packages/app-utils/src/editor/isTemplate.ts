import { Template } from "@easyblocks/core";
import { AnyTemplate, SpecialTemplate } from "../types";

export function isSpecialTemplate(
  template: AnyTemplate
): template is SpecialTemplate {
  return typeof (template as SpecialTemplate).specialRole === "string";
}

export function isTemplate(template: AnyTemplate): template is Template {
  return (template as any).specialRole === undefined;
}

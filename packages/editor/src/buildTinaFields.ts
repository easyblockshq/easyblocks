import { CompiledCustomComponentConfig, FieldPortal } from "@easyblocks/core";
import {
  InternalAnyTinaField,
  InternalField,
  stripRichTextPartSelection,
} from "@easyblocks/core/_internals";
import { dotNotationGet } from "@easyblocks/utils";
import type { EditorContextType } from "./EditorContext";
import { pathToCompiledPath } from "./pathToCompiledPath";

export function isFieldPortal(
  x: InternalAnyTinaField | FieldPortal
): x is FieldPortal {
  return "portal" in x;
}

export function buildTinaFields(
  path: string,
  editorContext: EditorContextType
) {
  return internalBuildTinaFields(path, editorContext);
}

function internalBuildTinaFields(
  path: string,
  editorContext: EditorContextType,
  fieldsFilter?: (field: InternalAnyTinaField | FieldPortal) => boolean
) {
  const compiledPath = pathToCompiledPath(
    stripRichTextPartSelection(path),
    editorContext
  );

  const compiledComponent: CompiledCustomComponentConfig = dotNotationGet(
    editorContext.compiledComponentConfig!,
    compiledPath
  );

  let allFields: InternalAnyTinaField[] = [];

  (compiledComponent.__editing?.fields ?? [])
    .filter((field) =>
      fieldsFilter ? fieldsFilter(field as InternalAnyTinaField) : true
    )
    .forEach((item) => {
      if (isFieldPortal(item)) {
        let fields: InternalAnyTinaField[] = [];

        if (item.portal === "component") {
          const portalComponentFields = internalBuildTinaFields(
            item.source,
            editorContext
          );
          fields.push(...portalComponentFields);

          if (!item.includeHeader) {
            fields = fields.filter((x) => x.prop !== "$myself");
          }

          const groups = item.groups;
          if (groups) {
            fields = fields.filter(
              (x) =>
                x.prop === "$myself" ||
                groups.includes(x.group || "___doesn't matter___")
            );
          }
        } else if (item.portal === "field") {
          if (item.hidden) {
            return;
          }

          const portalFieldFields = internalBuildTinaFields(
            item.source,
            editorContext,
            (field) => !isFieldPortal(field) && field.prop === item.fieldName
          );

          if (portalFieldFields.length === 0) {
            console.warn(
              `Missing field "${item.fieldName}" at path "${item.source}" in portal for component ${compiledComponent._template}`
            );
            return;
          }

          const portalField = {
            ...portalFieldFields[0],
            ...item.overrides,
          };

          fields.push(portalField);
        } else if (item.portal === "multi-field") {
          if (item.sources.length === 0) {
            if (item.hidden) {
              return;
            }

            throw new Error(
              `Missing sources for multi field portal of component "${compiledComponent._template}" at path "${path}". Set "hidden" to "true" for this portal if sources are empty`
            );
          }

          const portalFieldFields = item.sources.flatMap((source) =>
            internalBuildTinaFields(
              source,
              editorContext,
              (field) => !isFieldPortal(field) && field.prop === item.fieldName
            )
          );

          const firstField = portalFieldFields[0];
          const combinedField: InternalField = {
            ...firstField,
            ...item.overrides,
            name: portalFieldFields.flatMap((field) => field.name),
          };

          fields.push(combinedField);
        }

        allFields = [...allFields, ...fields];
      } else {
        allFields.push(item as InternalField);
      }
    });

  // Analytics fields should always go to the bottom (later they'll be in separate tab)

  const nonAnalyticsFields = allFields.filter((x) => x.group !== "Analytics");
  const analyticsFields = allFields.filter((x) => x.group === "Analytics");

  return [...nonAnalyticsFields, ...analyticsFields];
}

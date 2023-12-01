import { Form } from "@easyblocks/app-utils";
import { SchemaProp } from "@easyblocks/core";
import {
  CompilationContextType,
  InternalRenderableComponentDefinition,
  PathInfo,
  findComponentDefinitionById,
  parsePath,
} from "@easyblocks/core/_internals";
import { dotNotationGet } from "@easyblocks/utils";
import { insertCommand } from "./insert";

export interface Destination {
  name: string;
  index: number;
  insert: ReturnType<typeof insertCommand>;
}

export type ResolveDestination = ReturnType<typeof destinationResolver>;

function getSchema(path: PathInfo, context: CompilationContextType) {
  const parentDefinition = findComponentDefinitionById(
    path.parent?.templateId ?? "",
    context
  );

  const schema = (parentDefinition?.schema ?? []).find(
    (s) => s.prop === path.parent?.fieldName
  );

  return schema;
}

const toName = (destination: PathInfo) =>
  [destination.parent?.path, destination.parent?.fieldName]
    .filter(Boolean)
    .join(".");

const fixIndexInCollection = (index = 0, schema?: SchemaProp) => {
  if (schema?.type === "component-collection") {
    return index + 1;
  }
  return index;
};

function destinationResolver({
  form,
  context,
}: {
  context: CompilationContextType;
  form: Form;
}) {
  return function (initialDestinationPath: string) {
    const resolvedDestinations: Destination[] = [];

    const resolvedPaths = new Set<string>();
    const pathsQueue = [initialDestinationPath];

    while (pathsQueue.length > 0) {
      const path = pathsQueue.shift();
      if (!path) {
        continue;
      }

      if (resolvedPaths.has(path)) {
        continue;
      }

      if (!dotNotationGet(form.values, path)) {
        continue;
      }

      const parsed = parsePath(path, form);

      const definition = findComponentDefinitionById(
        parsed.templateId ?? "",
        context
      );

      if (!definition) {
        continue;
      }

      const schema = getSchema(parsed, context);

      resolvedDestinations.push({
        index: fixIndexInCollection(parsed.index, schema),
        name: toName(parsed),
        insert: insertCommand({
          context,
          form,
          schema,
          templateId: parsed.parent?.templateId,
        }),
      });

      for (const slot of (definition as InternalRenderableComponentDefinition)
        .pasteSlots ?? []) {
        const slotSchema = definition.schema.find(({ prop }) => prop === slot);

        if (!slotSchema) {
          continue;
        }

        const slotPath = `${path}.${slot}`;

        const slotValues = dotNotationGet(form.values, slotPath) ?? [];

        if (slotValues.length === 0) {
          resolvedDestinations.push({
            name: slotPath,
            index: 0,
            insert: insertCommand({
              context,
              form,
              schema: slotSchema,
              templateId: definition.id,
            }),
          });
        } else if (slotSchema.type === "component") {
          pathsQueue.push(`${slotPath}.0`);
        } else if (slotSchema.type === "component-collection") {
          pathsQueue.push(
            ...Array.from(Array(slotValues.length).keys())
              .map((idx) => `${slotPath}.${idx}`)
              .reverse()
          );
        }
      }
    }

    return resolvedDestinations;
  };
}

export { destinationResolver };

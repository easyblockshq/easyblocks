import { Form } from "@easyblocks/app-utils";
import {
  ComponentSchemaProp,
  ComponentConfig,
  isNoCodeComponentOfType,
} from "@easyblocks/core";
import {
  CompilationContextType,
  duplicateConfig,
  findComponentDefinitionById,
  parsePath,
} from "@easyblocks/core/_internals";
import {
  dotNotationGet,
  last,
  preOrderPathComparator,
} from "@easyblocks/utils";
import { EditorContextType } from "./EditorContext";
import { ResolveDestination } from "./paste/destinationResolver";
import { PasteCommand } from "./paste/manager";
import {
  DuplicateItemActionType,
  MoveItemActionType,
  RemoveItemActionType,
} from "./types";

function duplicateItem(
  form: Form,
  { name, sourceIndex, targetIndex }: DuplicateItemActionType,
  compilationContext: CompilationContextType
) {
  // Placeholders are not copyable
  if (isPlaceholder(name + "." + sourceIndex, form.values)) {
    return;
  }

  const configToDuplicate = dotNotationGet(
    form.values,
    name + "." + sourceIndex
  );

  form.mutators.insert(
    name,
    targetIndex,
    duplicateConfig(configToDuplicate, compilationContext)
  );
}

function pasteItems({
  what,
  where,
  resolveDestination,
  pasteCommand,
}: {
  what: Array<ComponentConfig>;
  where: Array<string>;
  resolveDestination: ResolveDestination;
  pasteCommand: PasteCommand;
}): Array<string> | undefined {
  const successfulInsertsPaths: string[] = [];

  takeLastOfEachParent(where)
    .sort(preOrderPathComparator())
    .map((initialDestination) => {
      const destination = successfulInsertsPaths.reduce(
        (acc, current) => shiftPath(acc, current, "downward"),
        initialDestination
      );

      const resolvedDestinations = resolveDestination(destination);

      return pasteCommand(resolvedDestinations);
    })
    .forEach((paste) => {
      what.forEach((item) => {
        const insertedPath = paste(item);
        if (insertedPath) {
          successfulInsertsPaths.push(insertedPath);
        }
      });
    });

  return successfulInsertsPaths.length !== 0 ? successfulInsertsPaths : where;
}

/**
 * Duplicates fields given in `fieldNames` within given `form`.
 * `compilationContext` is used to properly duplicate elements associated with given names.
 * @returns Array of fields to focus
 */
function duplicateItems(
  form: Form,
  fieldNames: Array<string>,
  compilationContext: CompilationContextType
): Array<string> | undefined {
  const duplicatableFieldNames = fieldNames.filter((fieldName) =>
    isFieldDuplicatable(fieldName, form, compilationContext)
  );

  if (duplicatableFieldNames.length === 0) {
    return;
  }

  const fieldsGroupedByParentPath = groupFieldsByParentPath(
    duplicatableFieldNames,
    "ascending"
  );

  const nextFocusedFieldsPerGroup: Array<Array<string>> = [];

  Object.values(fieldsGroupedByParentPath).forEach(
    (sortedFields, fieldsGroupIndex) => {
      nextFocusedFieldsPerGroup.push([]);

      const lastFieldIndex = getFieldPathIndex(last(sortedFields));

      sortedFields.forEach((focusedField, fieldIndex) => {
        const sourceIndex = getFieldPathIndex(focusedField);
        const targetIndex = lastFieldIndex + 1 + fieldIndex;
        const parentPath = getParentPath(focusedField);

        duplicateItem(
          form,
          {
            name: parentPath,
            sourceIndex,
            targetIndex,
          },
          compilationContext
        );

        nextFocusedFieldsPerGroup[fieldsGroupIndex].push(
          `${parentPath}.${lastFieldIndex + 1 + fieldIndex}`
        );
      });
    }
  );

  return nextFocusedFieldsPerGroup.flat();
}

function moveItem(form: Form, { from, to, name }: MoveItemActionType) {
  // Placeholders are not movable
  if (isPlaceholder(name + "." + from, form.values)) {
    return;
  }

  form.mutators.move(name, from, to);
}

/**
 * Moves fields given in `fieldNamesToRemove` within given `form` in given `direction`.
 * @returns Array of fields to focus.
 */
function moveItems(
  form: Form,
  fieldsToMove: Array<string>,
  direction: "top" | "right" | "bottom" | "left"
): Array<string> | undefined {
  const nextFocusedFields: Array<string> = [];
  const isMovingMultipleFields = fieldsToMove.length > 1;

  if (direction === "top" || direction === "left") {
    const fieldsGroupedByParentPath = groupFieldsByParentPath(
      fieldsToMove,
      "ascending"
    );

    Object.values(fieldsGroupedByParentPath).forEach((sortedFields) => {
      let wasAnyFieldWithinCurrentGroupMoved = false;

      sortedFields.forEach((fieldName, fieldNameIndex) => {
        const index = getFieldPathIndex(fieldName);
        const parentPath = getParentPath(fieldName);

        if (isFirst(fieldName)) {
          if (isMovingMultipleFields) {
            nextFocusedFields.push(fieldName);
          }

          return;
        }

        if (
          isMovingMultipleFields &&
          fieldNameIndex > 0 &&
          !wasAnyFieldWithinCurrentGroupMoved
        ) {
          nextFocusedFields.push(fieldName);
          return;
        }

        moveItem(form, {
          from: index,
          name: parentPath,
          to: index - 2,
        });

        if (!wasAnyFieldWithinCurrentGroupMoved) {
          wasAnyFieldWithinCurrentGroupMoved = true;
        }

        nextFocusedFields.push(`${parentPath}.${index - 2}`);
      });
    });

    if (nextFocusedFields.length > 0) {
      return nextFocusedFields;
    }
  } else {
    const fieldsGroupedByParentPath = groupFieldsByParentPath(
      fieldsToMove,
      "descending"
    );

    Object.values(fieldsGroupedByParentPath).forEach((sortedFields) => {
      let wasAnyFieldWithinCurrentGroupMoved = false;

      sortedFields.forEach((fieldName, fieldNameIndex) => {
        if (isLast(fieldName, form)) {
          if (isMovingMultipleFields) {
            nextFocusedFields.push(fieldName);
          }

          return;
        }

        if (
          isMovingMultipleFields &&
          fieldNameIndex > 0 &&
          !wasAnyFieldWithinCurrentGroupMoved
        ) {
          nextFocusedFields.push(fieldName);
          return;
        }

        const index = getFieldPathIndex(fieldName);
        const parentPath = getParentPath(fieldName);

        moveItem(form, {
          name: parentPath,
          from: index,
          to: index + 1,
        });

        if (!wasAnyFieldWithinCurrentGroupMoved) {
          wasAnyFieldWithinCurrentGroupMoved = true;
        }

        nextFocusedFields.push(`${parentPath}.${index + 1}`);
      });
    });

    if (nextFocusedFields.length > 0) {
      return nextFocusedFields;
    }
  }
}

function removeItem(form: Form, { index, name }: RemoveItemActionType) {
  const configPathToRemove = name + "." + index;

  // Placeholders are not removable
  if (isPlaceholder(configPathToRemove, form.values)) {
    return;
  }

  const componentConfigValue = dotNotationGet(form.values, name);

  if (componentConfigValue.length === 1) {
    form.change(name, []);
  } else {
    form.mutators.remove(name, index);
  }
}

/**
 * Removes fields given in `fieldNamesToRemove` from given `form`.
 * @returns Array of fields to focus
 */
function removeItems(
  form: Form,
  fieldNamesToRemove: Array<string>,
  compilationContext: CompilationContextType
): Array<string> | undefined {
  const removableFieldNames = fieldNamesToRemove.filter((fieldName) =>
    isFieldRemovable(fieldName, form, compilationContext)
  );

  if (removableFieldNames.length === 0) {
    return;
  }

  const isRemovingMultipleFields = removableFieldNames.length > 1;

  const fieldsGroupedByParentPath = groupFieldsByParentPath(
    removableFieldNames,
    "descending"
  );

  if (!isRemovingMultipleFields) {
    const { index, parent, templateId } = parsePath(
      removableFieldNames[0],
      form
    );

    if (index === undefined || !parent) {
      throw new Error("Invalid path");
    }

    const fieldPath = `${parent.path}${parent.path === "" ? "" : "."}${
      parent.fieldName
    }`;
    const itemsLength = dotNotationGet(form.values, fieldPath).length;
    const isOnlyItem = itemsLength === 1;
    const isLastItem = itemsLength - 1 === index;

    removeItem(form, {
      index,
      name: fieldPath,
    });

    const definition = findComponentDefinitionById(
      templateId,
      compilationContext
    );
    const isTextWrapper =
      definition &&
      isNoCodeComponentOfType(definition, "@easyblocks/text-wrapper");

    // If we're removing item from the text wrapper field let's focus the component holding that field for better UX
    // TODO: We shouldn't decide based on the component type but rather on the source of the removal (canvas vs sidebar)
    if (isTextWrapper) {
      return [parent.path];
    }

    if (isOnlyItem) {
      return [];
    } else if (isLastItem) {
      return [`${fieldPath}.${index - 1}`];
    } else {
      return [`${fieldPath}.${index}`];
    }
  }

  Object.values(fieldsGroupedByParentPath).forEach((sortedFields) => {
    sortedFields.forEach((focusedField) => {
      const field = dotNotationGet(form.values, focusedField);

      // Field could be already removed if its parent element was also selected
      if (!field) {
        return;
      }

      const index = getFieldPathIndex(focusedField);
      const parentPath = getParentPath(focusedField);

      removeItem(form, {
        index,
        name: parentPath,
      });
    });
  });

  return [];
}

function replaceItems(
  paths: string[],
  newConfig: ComponentConfig,
  editorContext: EditorContextType
) {
  paths.forEach((path) => {
    const oldConfig: ComponentConfig = dotNotationGet(
      editorContext.form.values,
      path
    );

    editorContext.form.change(
      path,
      duplicateConfig(
        // newConfig && oldConfig
        //   ? changeComponentConfig(oldConfig, newConfig, editorContext)
        //   : newConfig,
        newConfig,
        editorContext
      )
    );
  });
}

function logItems(form: Form, configPaths: Array<string>) {
  const configValues = configPaths.map((configPath) => {
    return dotNotationGet(form.values, configPath);
  });

  configValues.forEach((config, index) => {
    console.log("Config for", configPaths[index], config);
  });
}

export {
  duplicateItems,
  logItems,
  moveItems,
  pasteItems,
  removeItems,
  replaceItems,
};

function groupFieldsByParentPath(
  fields: Array<string>,
  sortDirection: "ascending" | "descending"
): Record<string, Array<string>> {
  const fieldsIndicesGroupedByParentPath = fields.reduce(
    (accumulator, currentField) => {
      const index = getFieldPathIndex(currentField);
      const parentPath = getParentPath(currentField);

      const indices = accumulator[parentPath];

      if (indices) {
        accumulator[parentPath] = [...indices, index].sort((a, b) => {
          return sortDirection === "descending" ? b - a : a - b;
        });
        return accumulator;
      }

      accumulator[parentPath] = [index];

      return accumulator;
    },
    {} as Record<string, Array<number>>
  );

  return Object.fromEntries(
    Object.entries(fieldsIndicesGroupedByParentPath).map(
      ([parentPath, indices]) => {
        return [parentPath, indices.map((index) => parentPath + "." + index)];
      }
    )
  );
}

function getFieldPathIndex(fieldPath: string): number {
  const index = +last(fieldPath.split("."));

  if (Number.isNaN(index)) {
    return -1;
  }

  return index;
}

function getParentPath(fieldPath: string): string {
  const fieldPathParts = fieldPath.split(".");

  return fieldPathParts.slice(0, -1).join(".");
}

function isFirst(fieldPath: string): boolean {
  const index = getFieldPathIndex(fieldPath);

  return index === 0;
}

function isLast(fieldPath: string, form: Form): boolean {
  const index = getFieldPathIndex(fieldPath);
  const parentPath = getParentPath(fieldPath);
  const parentFieldElementsCount = dotNotationGet(
    form.values,
    parentPath
  ).length;

  return index === parentFieldElementsCount - 1;
}

function isPlaceholder(path: string, values: any) {
  const templateId = dotNotationGet(values, path)._template;
  return templateId.startsWith("$Placeholder");
}

function isFieldRemovable(
  fieldName: string,
  form: Form,
  compilationContext: CompilationContextType
): boolean {
  const { parent } = parsePath(fieldName, form);

  if (parent) {
    const parentComponentDefinition = findComponentDefinitionById(
      parent.templateId,
      compilationContext
    );

    const fieldNameParent = last(getParentPath(fieldName).split("."));
    const fieldSchema = parentComponentDefinition?.schema.find(
      (schema) => schema.prop === fieldNameParent
    );

    if (
      fieldSchema &&
      fieldSchema.type === "component" &&
      (fieldSchema as ComponentSchemaProp).required
    ) {
      return false;
    }
  }

  return true;
}

function isFieldDuplicatable(
  fieldName: string,
  form: Form,
  compilationContext: CompilationContextType
): boolean {
  return isFieldRemovable(fieldName, form, compilationContext);
}

export const shiftPath = (
  originalPath: string,
  shiftingPath: string,
  direction: "upward" | "downward" = "downward"
) => {
  const directionFactor = direction === "downward" ? 1 : -1;

  const original = shiftingPath.split(".");
  const shifting = originalPath.split(".");

  if (original.length < 2) {
    return originalPath;
  }

  let index = 0;

  while (index < original.length - 1 && index < shifting.length - 1) {
    if (shifting[index] !== original[index]) {
      return originalPath;
    }

    if (shifting[index + 1] !== original[index + 1]) {
      const numberA = Number(original[index + 1]);
      const numberB = Number(shifting[index + 1]);

      if (
        numberA < numberB &&
        (index + 1 == original.length - 1 || index + 1 === shifting.length - 1)
      ) {
        shifting.splice(index + 1, 1, String(numberB + directionFactor));
        return shifting.join(".");
      } else {
        return originalPath;
      }
    }
    index += 2;
  }

  return originalPath;
};

export function takeLastOfEachParent(where: string[]) {
  const lastOfEachParent = where.reduce((acc, curr) => {
    const trimmed = getParentPath(curr);
    const index = getFieldPathIndex(curr);

    acc[trimmed] = Math.max(index, acc[trimmed] ?? Number.MIN_SAFE_INTEGER);

    return acc;
  }, {} as Record<string, number>);

  return Object.entries(lastOfEachParent).map(
    ([key, value]) => `${key}.${value}`
  );
}

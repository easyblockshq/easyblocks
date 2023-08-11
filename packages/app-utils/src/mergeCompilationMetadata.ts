import {
  CompilationMetadata,
  SerializedComponentDefinitions,
} from "@easyblocks/core";

export function mergeCompilationMeta(
  meta1: CompilationMetadata | undefined,
  meta2: CompilationMetadata | undefined
): CompilationMetadata {
  if (!meta2 && !meta1) {
    throw new Error("Can't merge empty metadata");
  }

  if (!meta2) {
    return meta1!;
  }

  if (!meta1) {
    return meta2;
  }

  return {
    code: { ...meta1.code, ...meta2.code },
    vars: {
      ...meta1.vars,
      ...meta2.vars,
      definitions: {
        actions: mergeDefinitions(
          meta1.vars.definitions?.actions ?? [],
          meta2.vars.definitions?.actions ?? []
        ),
        components: mergeDefinitions(
          meta1.vars.definitions?.components ?? [],
          meta2.vars.definitions?.components ?? []
        ),
        textModifiers: mergeDefinitions(
          meta1.vars.definitions?.textModifiers ?? [],
          meta2.vars.definitions?.textModifiers ?? []
        ),
        links: mergeDefinitions(
          meta1.vars.definitions?.links ?? [],
          meta2.vars.definitions?.links ?? []
        ),
      },
    },
  };
}

function mergeDefinitions<
  Definitions extends SerializedComponentDefinitions[keyof SerializedComponentDefinitions]
>(definitions1: Definitions, definitions2: Definitions) {
  const mergeDefinitions = [...definitions1];

  definitions2.forEach((definition) => {
    const isDuplicate = definitions1.some((d) => d.id === definition.id);

    if (isDuplicate) {
      return;
    }

    mergeDefinitions.push(definition);
  });

  return mergeDefinitions;
}

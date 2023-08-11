import { CompilationContextType } from "@easyblocks/app-utils";
import { ConfigComponent, ExternalReference } from "@easyblocks/core";
import { getAllExternals } from "./getAllExternals";

export function getExternalsForSave(
  configToSave: ConfigComponent,
  compilationContext: CompilationContextType
) {
  const externalReferences: ExternalReference[] = [];

  getAllExternals(configToSave, compilationContext).forEach((external) => {
    if (!external.value.id) {
      return;
    }

    let newExternalReference: ExternalReference;

    // We don't treat local. as external references
    if (external.value.id.startsWith("local.")) {
      return;
    }

    if (external.type === "image") {
      newExternalReference = {
        type: compilationContext.image.resourceType,
        id: external.value.id,
      };
    } else if (external.type === "video") {
      newExternalReference = {
        type: compilationContext.image.resourceType,
        id: external.value.id,
      };
    } else {
      newExternalReference = {
        type: external.type,
        id: external.value.id,
      };
    }

    // We don't want duplicates
    if (
      externalReferences.some(
        (x) =>
          x.id === newExternalReference.id &&
          x.type === newExternalReference.type
      )
    ) {
      return;
    }

    externalReferences.push(newExternalReference);
  });

  return externalReferences;
}

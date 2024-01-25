import { z } from "zod";
import { isCompiledComponentConfig } from "./isCompiledComponentConfig";
import {
  RenderableContent,
  NonEmptyRenderableContent,
  EmptyRenderableContent,
  Document,
  NoCodeComponentEntry,
  LocalValue,
  ExternalData,
  ExternalDataCompoundResourceResolvedResult,
  ExternalReference,
  ExternalReferenceEmpty,
} from "./types";

function isRenderableContent(input: unknown): input is RenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    (isCompiledComponentConfig(
      (input as { renderableContent: unknown }).renderableContent
    ) ||
      (input as { renderableContent: unknown }).renderableContent === null)
  );
}

function isNonEmptyRenderableContent(
  input: unknown
): input is NonEmptyRenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    isCompiledComponentConfig(
      (input as { renderableContent: unknown }).renderableContent
    )
  );
}

function isEmptyRenderableContent(
  input: unknown
): input is EmptyRenderableContent {
  return (
    typeof input === "object" &&
    input !== null &&
    "renderableContent" in input &&
    (input as { renderableContent: unknown }).renderableContent === null
  );
}

const documentSchema = z.object({
  documentId: z.string(),
  projectId: z.string(),
  rootContainer: z.string().optional(),
  preview: z.object({}).optional(),
  config: z.optional(z.object({})),
});

function isDocument(value: unknown): value is Document {
  return documentSchema.safeParse(value).success;
}

function isComponentConfig(value: any): value is NoCodeComponentEntry {
  return (
    typeof value === "object" &&
    typeof value?._component === "string" &&
    typeof value?._id === "string"
  );
}

const localValueSchema = z.object({
  value: z.any(),
  widgetId: z.string(),
});

function isLocalValue(value: any): value is LocalValue {
  return localValueSchema.safeParse(value).success;
}

export function isResolvedCompoundExternalDataValue(
  value: ExternalData[string]
): value is ExternalDataCompoundResourceResolvedResult {
  return "type" in value && value.type === "object" && "value" in value;
}

export function isIdReferenceToDocumentExternalValue(
  id: NonNullable<ExternalReference["id"]>
) {
  return typeof id === "string" && id.startsWith("$.");
}

export function isEmptyExternalReference(
  externalDataConfigEntry: ExternalReference
): externalDataConfigEntry is ExternalReferenceEmpty {
  return externalDataConfigEntry.id === null;
}

export {
  isRenderableContent,
  isNonEmptyRenderableContent,
  isEmptyRenderableContent,
  isDocument,
  isComponentConfig,
  isLocalValue,
};

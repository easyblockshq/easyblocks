import { z } from "zod";
import { isCompiledComponentConfig } from "./isCompiledComponentConfig";
import {
  RenderableContent,
  NonEmptyRenderableContent,
  EmptyRenderableContent,
  RawContentRemote,
  RawContentLocal,
  RawContentFull,
  RawContent,
  ContentPieceRemote,
  ContentPieceLocal,
  ContentPieceFull,
  ContentPiece,
  Document,
  ComponentConfig,
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

const rawContentSchema = z
  .object({
    id: z.string(),
    hash: z.string(),
    projectId: z.string().optional(),
    preview: z.object({}).optional(),
  })
  .strict();

export const isRawContentRemote = (
  value: unknown
): value is RawContentRemote => {
  return rawContentSchema.safeParse(value).success;
};

const rawContentLocalSchema = z
  .object({
    content: z.object({}),
    projectId: z.string().optional(),
    preview: z.object({}).optional(),
  })
  .strict();

export const isRawContentLocal = (value: unknown): value is RawContentLocal => {
  return rawContentLocalSchema.safeParse(value).success;
};

const rawContentFullSchema = z
  .object({
    id: z.string(),
    hash: z.string(),
    content: z.object({}),
    projectId: z.string().optional(),
    preview: z.object({}).optional(),
  })
  .strict();

export const isRawContentFull = (value: unknown): value is RawContentFull => {
  return rawContentFullSchema.safeParse(value).success;
};

export const isRawContent = (value: unknown): value is RawContent =>
  isRawContentRemote(value) ||
  isRawContentLocal(value) ||
  isRawContentFull(value);

export const isContentPieceRemote = (
  value: unknown
): value is ContentPieceRemote =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 2 &&
  "id" in value &&
  "hash" in value;

/**
 * @deprecated
 */
export const isContentPieceLocal = (
  value: unknown
): value is ContentPieceLocal =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 1 &&
  "config" in value;

/**
 * @deprecated
 */
export const isContentPieceFull = (value: unknown): value is ContentPieceFull =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 3 &&
  "id" in value &&
  "hash" in value &&
  "config" in value;

/**
 * @deprecated
 */
export const isContentPiece = (value: unknown): value is ContentPiece =>
  isContentPieceRemote(value) ||
  isContentPieceLocal(value) ||
  isContentPieceFull(value);

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

export function isComponentConfig(value: any): value is ComponentConfig {
  return (
    typeof value === "object" &&
    typeof value?._template === "string" &&
    typeof value?._id === "string"
  );
}

export {
  isRenderableContent,
  isNonEmptyRenderableContent,
  isEmptyRenderableContent,
  isDocument,
};

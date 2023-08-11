import {
  ContentPiece,
  ContentPieceFull,
  ContentPieceLocal,
  ContentPieceRemote,
} from "@easyblocks/core";

/*
 * @deprecated
 */
const isContentPieceRemote = (value: unknown): value is ContentPieceRemote =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 2 &&
  "id" in value &&
  "hash" in value;

/**
 * @deprecated
 */
const isContentPieceLocal = (value: unknown): value is ContentPieceLocal =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 1 &&
  "config" in value;

/**
 * @deprecated
 */
const isContentPieceFull = (value: unknown): value is ContentPieceFull =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 3 &&
  "id" in value &&
  "hash" in value &&
  "config" in value;

/**
 * @deprecated
 */
const isContentPiece = (value: unknown): value is ContentPiece =>
  isContentPieceRemote(value) ||
  isContentPieceLocal(value) ||
  isContentPieceFull(value);

export {
  isContentPiece,
  isContentPieceRemote,
  isContentPieceLocal,
  isContentPieceFull,
};

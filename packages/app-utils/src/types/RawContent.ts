import {
  RawContent,
  RawContentFull,
  RawContentLocal,
  RawContentRemote,
} from "@easyblocks/core";

export const isRawContentRemote = (value: unknown): value is RawContentRemote =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 2 &&
  "id" in value &&
  "hash" in value;

export const isRawContentLocal = (value: unknown): value is RawContentLocal =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 1 &&
  "content" in value;

export const isRawContentFull = (value: unknown): value is RawContentFull =>
  value !== null &&
  typeof value === "object" &&
  Object.keys(value).length === 3 &&
  "id" in value &&
  "hash" in value &&
  "content" in value;

export const isRawContent = (value: unknown): value is RawContent =>
  isRawContentRemote(value) ||
  isRawContentLocal(value) ||
  isRawContentFull(value);

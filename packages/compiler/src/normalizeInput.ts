import { getDefaultConfig } from "@easyblocks/app-utils";
import {
  ComponentConfig,
  ConfigComponent,
  ContentPiece,
  Document,
  EditorMode,
  RawContent,
  RawContentFull,
  RawContentLocal,
  isContentPiece,
  isContentPieceFull,
  isContentPieceLocal,
  isDocument,
  isRawContent,
  isRawContentFull,
  isRawContentLocal,
  isRawContentRemote,
  EditorLauncherProps,
} from "@easyblocks/core";

function isComponentConfig(value: any): value is ConfigComponent {
  return (
    typeof value === "object" &&
    typeof value?._template === "string" &&
    typeof value?._id === "string"
  );
}

export function isValidInput(
  input: unknown
): input is ContentPiece | RawContent | ComponentConfig {
  return (
    input === null ||
    input === undefined ||
    isComponentConfig(input) ||
    isContentPiece(input) ||
    isRawContent(input)
  );
}

export function normalizeInput(
  input: unknown,
  mode: EditorLauncherProps["rootContainer"] = "content"
): ConfigComponent {
  if (!isDocument(input)) {
    const normalizedRawContent = normalizeInputIntoRawContent(input, mode);
    const config = getConfigFromRawContent(normalizedRawContent);

    if (!config) {
      throw new Error("Missing component config within Content Piece");
    }

    return config;
  }

  if (input.config) {
    return input.config;
  }

  throw new Error("Internal error: Can't obtain config from remote document.");
}

function normalizeInputIntoRawContent(
  input: any,
  mode: NonNullable<EditorLauncherProps["rootContainer"]>
): RawContent {
  if (!input) {
    return {
      content: input ?? getDefaultConfig(mode),
    };
  }

  const rawContent = convertInputConfigIntoRawContent(input);

  if (isRawContentRemote(rawContent)) {
    return rawContent;
  }

  return {
    ...rawContent,
    content: rawContent.content,
  };
}
function getConfigFromRawContent(input: RawContent) {
  if (isRawContentLocal(input) || isRawContentFull(input)) {
    return input.content;
  } else {
    throw new Error("remote fetch of config unvailable");
    // const configResponse = await this.apiStorage.getConfigForLocale(
    //   { id: input.id },
    //   this.contextParams.locale
    // );
    //
    // if (!configResponse) {
    //   throw new Error(
    //     `ShopstoryClient was unable to fetch content piece with id "${input.id}"`
    //   );
    // }
    //
    // return configResponse.config;
  }
}

function convertInputConfigIntoRawContent(
  config: Document | ConfigComponent | ContentPiece | RawContent
): RawContent {
  if (isDocument(config) && config.config) {
    const rawContentLocal: RawContentLocal = {
      content: config.config,
    };

    return rawContentLocal;
  }

  if (isContentPiece(config)) {
    if (isContentPieceFull(config)) {
      const rawContentFull: RawContentFull = {
        id: config.id,
        hash: config.hash,
        content: config.config,
      };

      return rawContentFull;
    }

    if (isContentPieceLocal(config)) {
      const rawContentLocal: RawContentLocal = {
        content: config.config,
      };

      return rawContentLocal;
    }

    return config;
  }

  if (isComponentConfig(config)) {
    return {
      content: config,
    };
  }

  // At this point it's clear that we've received raw content, but overlapping with content piece makes TS stupid
  if (!isRawContent(config)) {
    throw new Error("Unreachable");
  }

  return config;
}

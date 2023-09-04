import { AssetDTO } from "@easyblocks/core";
import { toArray } from "@easyblocks/utils";
import { Files, formidable } from "formidable";
import { imageSize } from "image-size";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  AuthenticatedNextApiHandler,
  AuthenticatedNextApiRequest,
  withAccessToken,
} from "../../../../../helpers/withAccessToken";
import { withCors } from "../../../../../helpers/withCors";
import { internalServerErrorResponse } from "../../../../../application/apiResponse";
import { createSupabaseClient } from "../../../../../createSupabaseClient";

export const config = {
  api: {
    bodyParser: false,
  },
};

const assetMetadataSchema = z.object({
  width: z.number(),
  height: z.number(),
});

const handler: AuthenticatedNextApiHandler = async (req, res, accessToken) => {
  const projectId = req.query.projectId;

  if (Array.isArray(projectId)) {
    return res.status(400).json({ error: "projectId can't be array" });
  }

  const supabaseClient = createSupabaseClient(accessToken, projectId);

  // For some reason, the RLS policy doesn't work with authenticated users so we perform the check here instead
  const { data: projectIdFromToken, error } = await supabaseClient.rpc(
    "project_id_from_access_token"
  );

  if (error) {
    console.error(error);
    return internalServerErrorResponse(res);
  }

  // For some reason, the RLS policy doesn't work with authenticated users so we perform the check here instead
  if (projectIdFromToken !== projectId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "GET") {
    let assetsQueryResult = await supabaseClient.storage
      .from("assets")
      .list(projectId);

    if (assetsQueryResult.error) {
      console.error(error);
      return internalServerErrorResponse(res);
    }

    let files = assetsQueryResult.data;

    if (req.query.ids) {
      files = assetsQueryResult.data.filter((file) =>
        toArray(req.query.ids).includes(file.id)
      );
    }

    if (req.query.type) {
      const mimetypeMatcher =
        req.query.type === "image"
          ? /^image\//
          : req.query.type === "video"
          ? /^video\//
          : null;

      if (mimetypeMatcher) {
        files = files.filter((file) =>
          file.metadata.mimetype.match(mimetypeMatcher)
        );
      }
    }

    const { data: assetRecords = [] } = await supabaseClient
      .from("assets")
      .select("asset_id, metadata")
      .in(
        "asset_id",
        files.map((file) => file.id)
      );

    const assets = files.map((file) => {
      const assetRecord = assetRecords.find(
        (asset) => asset.asset_id === file.id
      );

      const assetUrl = supabaseClient.storage
        .from("assets")
        .getPublicUrl(`${projectId}/${file.name}`).data.publicUrl;

      let assetMetadata: { width: number; height: number } | null = null;

      if (file.metadata.mimetype.startsWith("image/")) {
        const assetMetadataParseResult = assetMetadataSchema.safeParse(
          assetRecord.metadata
        );

        if (assetMetadataParseResult.success === false) {
          console.error(assetMetadataParseResult.error);
          return internalServerErrorResponse(res);
        }

        assetMetadata = {
          width: assetMetadataParseResult.data.width,
          height: assetMetadataParseResult.data.height,
        };
      }

      const asset: AssetDTO = {
        id: file.id,
        name: file.name,
        url: assetUrl,
        ...(file.metadata.mimetype.startsWith("video/")
          ? {
              mediaType: "video",
              metadata: {
                mimeType: file.metadata.mimetype,
              },
            }
          : {
              mediaType: "image",
              metadata: {
                width: assetMetadata.width,
                height: assetMetadata.height,
                mimeType: file.metadata.mimetype,
              },
            }),
      };

      return asset;
    });

    return res.status(200).json(assets);
  }

  if (req.method === "POST") {
    let assetFile: Awaited<ReturnType<typeof getParsedAssetFile>>;

    try {
      assetFile = await getParsedAssetFile(req);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    let metadata: { width: number; height: number } | null = null;

    if (assetFile.mimeType.startsWith("image/")) {
      try {
        const { height, width } = imageSize(assetFile.content);
        metadata = { height, width };
      } catch (error) {
        console.error(error);
        return res.status(400).json({ error });
      }
    }

    const assetUploadResult = await supabaseClient.storage
      .from("assets")
      .upload(`${projectId}/${assetFile.name}`, assetFile.content, {
        contentType: assetFile.mimeType,
      });

    if (assetUploadResult.error) {
      // @ts-expect-error `StorageError` from Supabase is wrongly typed
      if (assetUploadResult.error.error === "Duplicate") {
        const assetFileNameWithoutExtension = path.basename(
          assetFile.name,
          assetFile.extension
        );
        const newAssetFileName = `${assetFileNameWithoutExtension} (1)${assetFile.extension}`;

        const assetUploadRetryResult = await supabaseClient.storage
          .from("assets")
          .upload(`${projectId}/${newAssetFileName}`, assetFile.content, {
            contentType: assetFile.mimeType,
          });

        if (assetUploadRetryResult.error) {
          console.error(assetUploadRetryResult.error);
          return internalServerErrorResponse(res);
        }

        return res.status(200).end();
      }

      console.error(assetUploadResult.error);
      return internalServerErrorResponse(res);
    }

    const fileAssetsForProjectResult = await supabaseClient.storage
      .from("assets")
      .list(projectId);

    const insertAssetResult = await supabaseClient.from("assets").insert({
      asset_id: fileAssetsForProjectResult.data.find(
        (a) => assetUploadResult.data.path.split("/").at(-1) === a.name
      ).id,
      metadata,
    });

    if (insertAssetResult.error) {
      console.error(insertAssetResult.error);
      return internalServerErrorResponse(res);
    }

    return res.status(200).end();
  }
};

export default withCors(withAccessToken(handler));

function getParsedAssetFile(req: AuthenticatedNextApiRequest) {
  const formParser = formidable({
    // 1MB
    // maxFileSize: 1 * 1024 * 1024,
  });

  return new Promise<{
    name: string;
    mimeType: string;
    content: Buffer;
    extension: string;
  }>((resolve, reject) => {
    formParser.parse(req, async (error, _, files) => {
      if (error) {
        console.error(error);
        reject(error);
      }

      if (!files.file) {
        reject(new Error("No file provided"));
      }

      const parsedFile = files.file[0] as Exclude<Files[string], Array<any>>;
      const fileContent = await fs.promises.readFile(parsedFile.filepath);

      const file = {
        name: parsedFile.originalFilename,
        mimeType: parsedFile.mimetype,
        content: fileContent,
        extension: `.${parsedFile.originalFilename.split(".").at(-1)}`,
      };

      resolve(file);
    });
  });
}

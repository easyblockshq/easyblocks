import {
  AuthenticatedNextApiHandler,
  withAccessToken,
} from "../../../../../../helpers/withAccessToken";
import { withCors } from "../../../../../../helpers/withCors";
import {
  internalServerErrorResponse,
  invalidRequestMethodErrorResponse,
  notFoundErrorResponse,
} from "../../../../../../application/apiResponse";
import { createSupabaseClient } from "../../../../../../createSupabaseClient";

const handler: AuthenticatedNextApiHandler = async (req, res, accessToken) => {
  const projectId = req.query.projectId as string;
  const supabaseClient = createSupabaseClient(accessToken, projectId);

  const { data: activeProjectId, error } = await supabaseClient.rpc(
    "active_project_id"
  );

  if (error) {
    console.error(error);
    return internalServerErrorResponse(res);
  }

  // For some reason, the RLS policy doesn't work with authenticated users so we perform the check here instead
  if (activeProjectId !== projectId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "DELETE") {
    const allFileAssetsOfProjectResult = await supabaseClient.storage
      .from("assets")
      .list(projectId);

    if (allFileAssetsOfProjectResult.error) {
      console.error(allFileAssetsOfProjectResult.error);
      return internalServerErrorResponse(res);
    }

    const fileAssetToBeRemoved = allFileAssetsOfProjectResult.data.find(
      (fileAsset) => fileAsset.id === req.query.assetId
    );

    if (!fileAssetToBeRemoved) {
      return notFoundErrorResponse(res);
    }

    const removeAssetResult = await supabaseClient
      .from("assets")
      .delete()
      .match({ asset_id: req.query.assetId });

    if (removeAssetResult.error) {
      console.error(removeAssetResult.error);
      return internalServerErrorResponse(res);
    }

    const removeFileResult = await supabaseClient.storage
      .from("assets")
      .remove([`${projectId}/${fileAssetToBeRemoved.name}`]);

    if (removeFileResult.error) {
      console.error(removeFileResult.error);
      return internalServerErrorResponse(res);
    }

    return res.status(200).end();
  }

  return invalidRequestMethodErrorResponse(res);
};

export default withCors(withAccessToken(handler));

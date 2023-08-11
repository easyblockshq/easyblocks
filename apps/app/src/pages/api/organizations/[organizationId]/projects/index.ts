import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler } from "next";
import { Database } from "@/infrastructure/supabaseSchema";
import {
  internalServerErrorResponse,
  invalidRequestMethodErrorResponse,
} from "@/application/apiResponse";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { organizationId } = req.query;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Missing name" });
      return;
    }

    const insertProjectResult = await supabase
      .from("projects")
      .insert({
        name,
        organization_id: organizationId,
      })
      .select();

    if (insertProjectResult.error) {
      internalServerErrorResponse(res);
      return;
    }

    res.status(200).json(insertProjectResult.data);
    return;
  }

  invalidRequestMethodErrorResponse(res);
};

export default handler;

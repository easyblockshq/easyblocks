import type { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../infrastructure/supabaseSchema";
import { TokenService } from "../../../infrastructure/TokensService";

const confirmHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.end(400).json({ error: "Invalid HTTP method" });
    return;
  }

  const supabase = createPagesServerClient<Database>(
    { req, res },
    {
      options: {
        global: {
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        },
      },
    }
  );

  const code = req.query.code;

  if (!code || Array.isArray(code)) {
    res.status(400).json({ error: "Missing or invalid code format" });
    return;
  }

  const sessionResponse = await supabase.auth.exchangeCodeForSession(code);

  if (sessionResponse.error) {
    res.status(400).json({ error: "Invalid code" });
    return;
  }

  const { user } = sessionResponse.data;

  // When user confirms their account, we create a default organization for them.
  const insertOrganizationResult = await supabase
    .from("organizations")
    .insert({
      name: `${user.email}'s organization`,
    })
    .select("id");

  if (insertOrganizationResult.data) {
    // After the organization is created, we add the user to the organization.
    const insertOrganizationUserResult = await supabase
      .from("organizations_users")
      .insert({
        organization_id: insertOrganizationResult.data[0].id,
        user_id: user.id,
      });

    if (!insertOrganizationUserResult.error) {
      // Finally, we create a default project for the user in his organization.
      const insertProjectResult = await supabase
        .from("projects")
        .insert({
          name: `${user.email}'s project`,
          organization_id: insertOrganizationResult.data[0].id,
        })
        .select("id");

      if (!insertProjectResult.error) {
        const projectId = insertProjectResult.data[0].id;
        const token = TokenService.getAccessToken(projectId);

        await supabase
          .from("projects")
          .update({
            tokens: [token],
          })
          .eq("id", projectId);
      }
    }
  }

  res.redirect("/");
};

export default confirmHandler;

import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const supabase = createPagesServerClient({ req, res });

  if (req.method === "POST") {
    const result = await supabase.from("organizations").insert({
      name: `Default organization`,
    });

    if (result.error) {
      res.status(500).json({ error: result.error });
      return;
    }

    res.status(200).end();
  } else {
    res.status(400).end();
  }
};

export default handler;

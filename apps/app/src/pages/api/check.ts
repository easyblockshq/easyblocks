import type { NextApiRequest, NextApiResponse } from "next";

const SUPABASE_API_URL = process.env.SUPABASE_API_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  response.status(200).json({
    SUPABASE_API_URL,
    SUPABASE_API_KEY,
  });
}

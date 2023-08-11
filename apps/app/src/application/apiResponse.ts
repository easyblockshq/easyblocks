import { NextApiResponse } from "next";

function internalServerErrorResponse(res: NextApiResponse) {
  return res.status(500).json({ message: "Internal server error" });
}

function invalidRequestMethodErrorResponse(res: NextApiResponse) {
  return res.status(400).json({ message: "Invalid HTTP method" });
}

function notFoundErrorResponse(res: NextApiResponse) {
  return res.status(404).json({ message: "Not found" });
}

export {
  internalServerErrorResponse,
  invalidRequestMethodErrorResponse,
  notFoundErrorResponse,
};

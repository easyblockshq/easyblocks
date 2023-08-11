import { NextApiHandler } from "next";

const withCors =
  (handler: NextApiHandler): NextApiHandler =>
  (request, response) => {
    if (request.method === "OPTIONS") {
      response.status(200).end();
      return;
    }

    return handler(request, response);
  };
export { withCors };

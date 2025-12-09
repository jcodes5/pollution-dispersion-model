import { VercelRequest, VercelResponse } from "@vercel/node";
import { createServer } from "../server";

let app: ReturnType<typeof createServer> | null = null;

function initializeApp() {
  if (!app) {
    app = createServer();
  }
  return app;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const application = initializeApp();
  return application(req, res);
}

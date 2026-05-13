import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/config", (_req, res) => {
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY ?? process.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";
  const proxyPath = process.env.CLERK_PROXY_URL ?? "";
  const proxyUrl = proxyPath
    ? `https://${process.env.REPLIT_INTERNAL_APP_DOMAIN ?? process.env.REPLIT_DEV_DOMAIN ?? ""}${proxyPath}`
    : undefined;

  res.json({ publishableKey, ...(proxyUrl ? { proxyUrl } : {}) });
});

export default router;

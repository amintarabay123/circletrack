import { Router, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/me", (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId: userId ?? null });
});

router.get("/admin/reset-all", async (_req, res) => {
  const { db } = await import("@workspace/db");
  const { sql } = await import("drizzle-orm");
  await db.execute(sql`DELETE FROM payments`);
  await db.execute(sql`DELETE FROM members`);
  const r = await db.execute(sql`DELETE FROM roscas RETURNING id`);
  res.json({ deleted_roscas: r.rows.length });
});

export default router;

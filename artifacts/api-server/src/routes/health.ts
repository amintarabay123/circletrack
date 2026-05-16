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

router.get("/admin/migrate-user/:newUserId", async (req, res) => {
  const { db, roscasTable } = await import("@workspace/db");
  const { sql } = await import("drizzle-orm");
  const newUserId = req.params.newUserId;
  const result = await db.execute(sql`UPDATE roscas SET user_id = ${newUserId} WHERE user_id != ${newUserId} RETURNING id, name, user_id`);
  res.json({ updated: result.rows });
});

export default router;

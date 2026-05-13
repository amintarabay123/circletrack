import { Router, type IRouter } from "express";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { db, roscasTable, membersTable, paymentsTable } from "@workspace/db";
import {
  CreateRoscaBody,
  UpdateRoscaBody,
  AddMemberBody,
  UpdateMemberBody,
  ListPaymentsQueryParams,
  RecordPaymentBody,
} from "@workspace/api-zod";
import { addWeeks, addMonths, isAfter, parseISO, format } from "date-fns";
import { getAuth } from "@clerk/express";

const router: IRouter = Router();

function parseId(raw: unknown): number | null {
  const n = parseInt(String(raw), 10);
  return isNaN(n) ? null : n;
}

function getUserId(req: any): string | null {
  const auth = getAuth(req);
  return auth?.userId ?? null;
}

const requireAuth = (req: any, res: any, next: any) => {
  const userId = getUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  req.userId = userId;
  next();
};

router.use(requireAuth);

async function checkRoscaOwnership(id: number, userId: string, res: any): Promise<typeof roscasTable.$inferSelect | null> {
  const [rosca] = await db.select().from(roscasTable).where(eq(roscasTable.id, id));
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return null; }
  if (rosca.userId && rosca.userId !== userId) { res.status(403).json({ error: "Forbidden" }); return null; }
  return rosca;
}

// Returns the Nth semimonthly date (15th or 30th/last-of-month) on or after the
// start date, advancing N-1 more periods. cycle=1 → first due on/after start.
function getSemimonthlyDate(startDate: string, cycle: number): Date {
  const start = parseISO(startDate.slice(0, 10));
  const startDay = start.getDate();
  let year = start.getFullYear();
  let month = start.getMonth();

  function lastDay(y: number, m: number): number {
    return new Date(y, m + 1, 0).getDate();
  }
  function secondHalfDay(y: number, m: number): number {
    return Math.min(30, lastDay(y, m));
  }

  let half: "first" | "second";
  let dueDay: number;

  if (startDay <= 15) {
    half = "first";
    dueDay = 15;
  } else {
    half = "second";
    dueDay = secondHalfDay(year, month);
    if (startDay > dueDay) {
      half = "first";
      month += 1;
      if (month > 11) { month = 0; year += 1; }
      dueDay = 15;
    }
  }

  let advances = cycle - 1;
  while (advances > 0) {
    if (half === "first") {
      half = "second";
      dueDay = secondHalfDay(year, month);
    } else {
      half = "first";
      month += 1;
      if (month > 11) { month = 0; year += 1; }
      dueDay = 15;
    }
    advances -= 1;
  }
  return new Date(year, month, dueDay);
}

/** Nth due on the 1st or 15th on or after startDate (inclusive). Cycle 1 = first such date. */
function getFirstFifteenthDueDate(startDate: string, cycle: number): Date {
  const start = parseISO(startDate.slice(0, 10));
  const startTs = start.getTime();
  let y = start.getFullYear();
  let m = start.getMonth();
  const collected: Date[] = [];
  let guard = 0;
  while (collected.length < cycle + 2 && guard++ < 600) {
    for (const dom of [1, 15] as const) {
      const dt = new Date(y, m, dom);
      if (dt.getTime() >= startTs) collected.push(dt);
    }
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  const due = collected[cycle - 1];
  if (!due) throw new Error("getFirstFifteenthDueDate: cycle out of range");
  return due;
}

function getCycleDueDate(startDate: string, frequency: string, cycle: number): string {
  const start = parseISO(startDate.slice(0, 10));
  let due: Date;
  if (frequency === "weekly") due = addWeeks(start, cycle);
  else if (frequency === "biweekly") due = addWeeks(start, cycle * 2);
  else if (frequency === "semimonthly") due = getSemimonthlyDate(startDate, cycle);
  else if (frequency === "first_fifteenth") due = getFirstFifteenthDueDate(startDate, cycle);
  else due = addMonths(start, cycle);
  return format(due, "yyyy-MM-dd");
}

function getCycleStartDate(startDate: string, frequency: string, cycle: number): string {
  if (frequency === "semimonthly") {
    if (cycle === 1) return startDate.slice(0, 10);
    return format(getSemimonthlyDate(startDate, cycle - 1), "yyyy-MM-dd");
  }
  if (frequency === "first_fifteenth") {
    if (cycle === 1) return startDate.slice(0, 10);
    return format(getFirstFifteenthDueDate(startDate, cycle - 1), "yyyy-MM-dd");
  }
  const start = parseISO(startDate.slice(0, 10));
  let s: Date;
  if (frequency === "weekly") s = addWeeks(start, cycle - 1);
  else if (frequency === "biweekly") s = addWeeks(start, (cycle - 1) * 2);
  else s = addMonths(start, cycle - 1);
  return format(s, "yyyy-MM-dd");
}

function formatRosca(r: typeof roscasTable.$inferSelect) {
  const startDate = r.startDate.slice(0, 10);
  return { ...r, contributionAmount: parseFloat(r.contributionAmount), startDate };
}

// List all roscas
router.get("/roscas", async (req: any, res): Promise<void> => {
  const userId = req.userId;
  // Auto-claim any unowned roscas on first login
  await db.update(roscasTable).set({ userId }).where(isNull(roscasTable.userId));
  const roscas = await db.select().from(roscasTable)
    .where(eq(roscasTable.userId, userId))
    .orderBy(roscasTable.createdAt);
  res.json(roscas.map(formatRosca));
});

function startDateToYmd(value: Date | string): string {
  if (typeof value === "string") {
    const s = value.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  }
  if (value instanceof Date && !isNaN(value.getTime())) {
    return format(value, "yyyy-MM-dd");
  }
  throw new Error("Invalid startDate");
}

// Create a rosca
router.post("/roscas", async (req: any, res): Promise<void> => {
  const parsed = CreateRoscaBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  let startYmd: string;
  try {
    startYmd = startDateToYmd(parsed.data.startDate);
  } catch {
    res.status(400).json({ error: "Invalid startDate" });
    return;
  }
  try {
    const [rosca] = await db.insert(roscasTable).values({
      userId: req.userId,
      name: parsed.data.name,
      startDate: startYmd,
      frequency: parsed.data.frequency,
      contributionAmount: String(parsed.data.contributionAmount),
      totalCycles: parsed.data.totalCycles,
      currentCycle: 1,
      isActive: true,
    }).returning();
    res.status(201).json(formatRosca(rosca));
  } catch (e) {
    console.error("[POST /roscas] insert failed:", e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Insert failed" });
  }
});

// Get a single rosca
router.get("/roscas/:id", async (req: any, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const rosca = await checkRoscaOwnership(id, req.userId, res);
  if (!rosca) return;
  res.json(formatRosca(rosca));
});

// Update a rosca
router.put("/roscas/:id", async (req: any, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  if (!await checkRoscaOwnership(id, req.userId, res)) return;
  const parsed = UpdateRoscaBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  let startYmd: string;
  try {
    startYmd = startDateToYmd(parsed.data.startDate);
  } catch {
    res.status(400).json({ error: "Invalid startDate" });
    return;
  }
  try {
    const [rosca] = await db.update(roscasTable).set({
      name: parsed.data.name,
      startDate: startYmd,
      frequency: parsed.data.frequency,
      contributionAmount: String(parsed.data.contributionAmount),
      totalCycles: parsed.data.totalCycles,
    }).where(eq(roscasTable.id, id)).returning();
    if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
    res.json(formatRosca(rosca));
  } catch (e) {
    console.error("[PUT /roscas/:id] update failed:", e);
    res.status(500).json({ error: e instanceof Error ? e.message : "Update failed" });
  }
});

// Advance rosca cycle
router.patch("/roscas/:id/advance", async (req: any, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const rosca = await checkRoscaOwnership(id, req.userId, res);
  if (!rosca) return;
  if (rosca.currentCycle >= rosca.totalCycles) {
    res.status(400).json({ error: "Already at final cycle" }); return;
  }
  const [updated] = await db.update(roscasTable)
    .set({ currentCycle: rosca.currentCycle + 1 })
    .where(eq(roscasTable.id, id)).returning();
  res.json(formatRosca(updated));
});

// Roll back rosca cycle by one
router.patch("/roscas/:id/rollback", async (req: any, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const rosca = await checkRoscaOwnership(id, req.userId, res);
  if (!rosca) return;
  if (rosca.currentCycle <= 1) {
    res.status(400).json({ error: "Already at first cycle" }); return;
  }
  const [updated] = await db.update(roscasTable)
    .set({ currentCycle: rosca.currentCycle - 1 })
    .where(eq(roscasTable.id, id)).returning();
  res.json(formatRosca(updated));
});

// Delete a rosca
router.delete("/roscas/:id", async (req: any, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  if (!await checkRoscaOwnership(id, req.userId, res)) return;
  await db.delete(roscasTable).where(eq(roscasTable.id, id));
  res.sendStatus(204);
});

// Export a rosca as JSON (full data backup)
router.get("/roscas/:id/export", async (req: any, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const rosca = await checkRoscaOwnership(id, req.userId, res);
  if (!rosca) return;
  const members = await db.select().from(membersTable).where(eq(membersTable.roscaId, id)).orderBy(membersTable.turnOrder, membersTable.createdAt);
  const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.roscaId, id)).orderBy(paymentsTable.cycle, paymentsTable.paidAt);
  const exportData = {
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    rosca: formatRosca(rosca),
    members: members.map(m => ({ name: m.name, phone: m.phone, email: m.email, shares: m.shares, turnOrder: m.turnOrder })),
    payments: payments.map(p => ({
      memberName: members.find(m => m.id === p.memberId)?.name ?? "",
      cycle: p.cycle, amount: parseFloat(p.amount), paidAt: p.paidAt.toISOString(),
      dueDate: p.dueDate, isLate: p.isLate, notes: p.notes,
    })),
  };
  res.setHeader("Content-Disposition", `attachment; filename="${rosca.name.replace(/[^a-z0-9]/gi, "_")}.json"`);
  res.json(exportData);
});

// Import a rosca from JSON
router.post("/roscas/import", async (req: any, res): Promise<void> => {
  const { rosca: r, members: ms, payments: ps } = req.body;
  if (!r || !r.name) { res.status(400).json({ error: "Invalid import data" }); return; }
  const mode = req.body.mode ?? "archive"; // 'archive' = keep dates, 'template' = reset to today
  const startDate = mode === "template" ? new Date().toISOString().split("T")[0] : (r.startDate?.slice(0, 10) ?? new Date().toISOString().split("T")[0]);
  const [newRosca] = await db.insert(roscasTable).values({
    userId: req.userId,
    name: r.name,
    startDate,
    frequency: r.frequency ?? "monthly",
    contributionAmount: String(r.contributionAmount ?? 0),
    totalCycles: r.totalCycles ?? 1,
    currentCycle: mode === "template" ? 1 : (r.currentCycle ?? 1),
    isActive: mode === "template" ? true : (r.isActive ?? true),
  }).returning();
  const memberMap = new Map<string, number>();
  if (Array.isArray(ms)) {
    for (const m of ms) {
      const [newMember] = await db.insert(membersTable).values({
        roscaId: newRosca.id, name: m.name, phone: m.phone ?? null, email: m.email ?? null,
        shares: m.shares ?? 1, turnOrder: m.turnOrder ?? null,
      }).returning();
      memberMap.set(m.name, newMember.id);
    }
  }
  if (mode === "archive" && Array.isArray(ps)) {
    for (const p of ps) {
      const memberId = memberMap.get(p.memberName);
      if (!memberId) continue;
      await db.insert(paymentsTable).values({
        roscaId: newRosca.id, memberId, cycle: p.cycle,
        amount: String(p.amount), paidAt: new Date(p.paidAt),
        dueDate: p.dueDate ?? startDate, isLate: p.isLate ?? false, notes: p.notes ?? null,
      });
    }
  }
  res.status(201).json(formatRosca(newRosca));
});

// List members
router.get("/roscas/:id/members", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const members = await db.select().from(membersTable)
    .where(eq(membersTable.roscaId, id))
    .orderBy(membersTable.turnOrder, membersTable.createdAt);
  res.json(members);
});

// Add member
router.post("/roscas/:id/members", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = AddMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [member] = await db.insert(membersTable).values({
    roscaId: id,
    name: parsed.data.name,
    phone: parsed.data.phone ?? null,
    email: parsed.data.email ?? null,
    shares: parsed.data.shares,
    turnOrder: parsed.data.turnOrder ?? null,
  }).returning();
  res.status(201).json(member);
});

// Update member
router.put("/roscas/:id/members/:memberId", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const memberId = parseId(req.params.memberId);
  if (!id || !memberId) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [member] = await db.update(membersTable).set({
    name: parsed.data.name,
    phone: parsed.data.phone ?? null,
    email: parsed.data.email ?? null,
    shares: parsed.data.shares,
    turnOrder: parsed.data.turnOrder ?? null,
  }).where(and(eq(membersTable.id, memberId), eq(membersTable.roscaId, id))).returning();
  if (!member) { res.status(404).json({ error: "Member not found" }); return; }
  res.json(member);
});

// Delete member
router.delete("/roscas/:id/members/:memberId", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const memberId = parseId(req.params.memberId);
  if (!id || !memberId) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(membersTable)
    .where(and(eq(membersTable.id, memberId), eq(membersTable.roscaId, id)));
  res.sendStatus(204);
});

// List payments
router.get("/roscas/:id/payments", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const query = ListPaymentsQueryParams.safeParse(req.query);
  const cycleFilter = query.success && query.data.cycle != null ? query.data.cycle : null;
  const conditions = [eq(paymentsTable.roscaId, id)];
  if (cycleFilter !== null) conditions.push(eq(paymentsTable.cycle, cycleFilter));
  const payments = await db.select({
    id: paymentsTable.id,
    roscaId: paymentsTable.roscaId,
    memberId: paymentsTable.memberId,
    memberName: membersTable.name,
    memberShares: membersTable.shares,
    cycle: paymentsTable.cycle,
    amount: paymentsTable.amount,
    paidAt: paymentsTable.paidAt,
    dueDate: paymentsTable.dueDate,
    isLate: paymentsTable.isLate,
    notes: paymentsTable.notes,
  }).from(paymentsTable)
    .innerJoin(membersTable, eq(paymentsTable.memberId, membersTable.id))
    .where(and(...conditions))
    .orderBy(paymentsTable.paidAt);
  res.json(payments.map(p => ({ ...p, amount: parseFloat(p.amount) })));
});

// Record payment
router.post("/roscas/:id/payments", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = RecordPaymentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [rosca] = await db.select().from(roscasTable).where(eq(roscasTable.id, id));
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
  const [member] = await db.select().from(membersTable).where(eq(membersTable.id, parsed.data.memberId));
  if (!member) { res.status(404).json({ error: "Member not found" }); return; }
  const dueDate = getCycleDueDate(rosca.startDate, rosca.frequency, parsed.data.cycle);
  const paidAt = new Date(parsed.data.paidAt);
  const dueDateObj = parseISO(dueDate);
  const isLate = isAfter(paidAt, dueDateObj);
  const [payment] = await db.insert(paymentsTable).values({
    roscaId: id,
    memberId: parsed.data.memberId,
    cycle: parsed.data.cycle,
    amount: String(parsed.data.amount),
    paidAt,
    dueDate,
    isLate,
    notes: parsed.data.notes ?? null,
  }).returning();
  res.status(201).json({ ...payment, memberName: member.name, amount: parseFloat(payment.amount) });
});

// Delete payment
router.delete("/roscas/:id/payments/:paymentId", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const paymentId = parseId(req.params.paymentId);
  if (!id || !paymentId) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(paymentsTable)
    .where(and(eq(paymentsTable.id, paymentId), eq(paymentsTable.roscaId, id)));
  res.sendStatus(204);
});

// Member payment report
router.get("/roscas/:id/members/:memberId/report", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const memberId = parseId(req.params.memberId);
  if (!id || !memberId) { res.status(400).json({ error: "Invalid id" }); return; }
  const [rosca] = await db.select().from(roscasTable).where(eq(roscasTable.id, id));
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
  const [member] = await db.select().from(membersTable)
    .where(and(eq(membersTable.id, memberId), eq(membersTable.roscaId, id)));
  if (!member) { res.status(404).json({ error: "Member not found" }); return; }
  const allPayments = await db.select().from(paymentsTable)
    .where(and(eq(paymentsTable.roscaId, id), eq(paymentsTable.memberId, memberId)))
    .orderBy(paymentsTable.cycle, paymentsTable.paidAt);
  const contributionAmount = parseFloat(rosca.contributionAmount);
  const expectedPerCycle = contributionAmount * member.shares;
  const cycles = Array.from({ length: rosca.totalCycles }, (_, i) => {
    const cycle = i + 1;
    const dueDate = getCycleDueDate(rosca.startDate, rosca.frequency, cycle);
    const cyclePayments = allPayments.filter(p => p.cycle === cycle);
    const totalPaid = cyclePayments.reduce((s, p) => s + parseFloat(p.amount), 0);
    const balance = Math.max(0, expectedPerCycle - totalPaid);
    const isUpcoming = cycle > rosca.currentCycle;
    const status = isUpcoming ? "upcoming" : totalPaid === 0 ? "missed" : balance > 0 ? "partial" : "paid";
    const isLate = cyclePayments.some(p => p.isLate);
    return { cycle, dueDate, expectedAmount: expectedPerCycle, totalPaid, balance, status, isLate, payments: cyclePayments.map(p => ({ id: p.id, amount: parseFloat(p.amount), paidAt: p.paidAt.toISOString(), isLate: p.isLate, notes: p.notes })) };
  });
  const pastCycles = cycles.filter(c => c.status !== "upcoming");
  const summary = {
    totalExpected: pastCycles.reduce((s, c) => s + c.expectedAmount, 0),
    totalPaid: pastCycles.reduce((s, c) => s + c.totalPaid, 0),
    totalBalance: pastCycles.reduce((s, c) => s + c.balance, 0),
    paidCycles: pastCycles.filter(c => c.status === "paid").length,
    partialCycles: pastCycles.filter(c => c.status === "partial").length,
    missedCycles: pastCycles.filter(c => c.status === "missed").length,
  };
  res.json({ member, rosca: formatRosca(rosca), cycles, summary });
});

// Dashboard summary
router.get("/roscas/:id/dashboard", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const [rosca] = await db.select().from(roscasTable).where(eq(roscasTable.id, id));
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
  const members = await db.select().from(membersTable)
    .where(eq(membersTable.roscaId, id))
    .orderBy(membersTable.turnOrder, membersTable.createdAt);
  const currentCycle = rosca.currentCycle;
  const contributionAmount = parseFloat(rosca.contributionAmount);
  const cyclePayments = await db.select({
    memberId: paymentsTable.memberId,
    amount: paymentsTable.amount,
    paidAt: paymentsTable.paidAt,
    isLate: paymentsTable.isLate,
  }).from(paymentsTable)
    .where(and(eq(paymentsTable.roscaId, id), eq(paymentsTable.cycle, currentCycle)));
  const cycleStartDate = getCycleStartDate(rosca.startDate, rosca.frequency, currentCycle);
  const cycleDueDate = getCycleDueDate(rosca.startDate, rosca.frequency, currentCycle);
  // Sum ALL payments per member for the cycle (supports multiple partial payments)
  const paymentByMember = new Map<number, { totalPaid: number; lastPaidAt: Date; isLate: boolean }>();
  for (const p of cyclePayments) {
    const existing = paymentByMember.get(p.memberId);
    if (existing) {
      existing.totalPaid += parseFloat(p.amount);
      if (p.paidAt > existing.lastPaidAt) existing.lastPaidAt = p.paidAt;
      if (p.isLate) existing.isLate = true;
    } else {
      paymentByMember.set(p.memberId, { totalPaid: parseFloat(p.amount), lastPaidAt: p.paidAt, isLate: p.isLate });
    }
  }
  const memberStatuses = members.map(m => {
    const amountDue = contributionAmount * m.shares;
    const info = paymentByMember.get(m.id);
    const amountPaid = info ? info.totalPaid : 0;
    const isPaid = amountPaid >= amountDue - 0.001;
    const isPartial = amountPaid > 0 && !isPaid;
    const balance = Math.max(0, amountDue - amountPaid);
    return {
      memberId: m.id, memberName: m.name, shares: m.shares,
      amountDue, amountPaid, balance,
      isPaid, isPartial,
      isLate: info ? info.isLate : false,
      paidAt: info ? info.lastPaidAt.toISOString() : null,
    };
  });
  const totalExpected = memberStatuses.reduce((sum, m) => sum + m.amountDue, 0);
  const totalCollected = memberStatuses.reduce((sum, m) => sum + m.amountPaid, 0);
  const paidCount = memberStatuses.filter(m => m.isPaid).length;
  const partialCount = memberStatuses.filter(m => m.isPartial).length;
  const unpaidCount = memberStatuses.filter(m => !m.isPaid && !m.isPartial).length;
  const lateCount = memberStatuses.filter(m => m.isLate).length;
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
  const potMember = members.find(m => m.turnOrder === currentCycle) ?? members[currentCycle - 1] ?? null;
  res.json({
    rosca: formatRosca(rosca), currentCycle, cycleStartDate, cycleDueDate,
    totalExpected, totalCollected, collectionRate, paidCount, partialCount, unpaidCount, lateCount,
    memberStatuses, potAmount: totalExpected, potRecipient: potMember ? potMember.name : null,
  });
});

// Member ratings
router.get("/roscas/:id/member-ratings", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const [rosca] = await db.select().from(roscasTable).where(eq(roscasTable.id, id));
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
  const members = await db.select().from(membersTable)
    .where(eq(membersTable.roscaId, id))
    .orderBy(membersTable.turnOrder, membersTable.createdAt);
  const allPayments = await db.select().from(paymentsTable).where(eq(paymentsTable.roscaId, id));
  const currentCycle = rosca.currentCycle;
  const ratings = members.map(m => {
    const mp = allPayments.filter(p => p.memberId === m.id);
    const onTime = mp.filter(p => !p.isLate).length;
    const late = mp.filter(p => p.isLate).length;
    const missed = Math.max(0, currentCycle - mp.length);
    const score = currentCycle > 0 ? Math.round((onTime / currentCycle) * 100) : 100;
    const rating = score >= 90 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "fair" : "poor";
    return { memberId: m.id, memberName: m.name, shares: m.shares, totalPayments: mp.length, onTimePayments: onTime, latePayments: late, missedPayments: missed, reliabilityScore: score, rating };
  });
  res.json(ratings);
});

// Delete account — remove all user data
router.delete("/account", async (req: any, res): Promise<void> => {
  const userId = req.userId;
  const userRoscas = await db.select({ id: roscasTable.id })
    .from(roscasTable)
    .where(eq(roscasTable.userId, userId));
  if (userRoscas.length > 0) {
    const roscaIds = userRoscas.map(r => r.id);
    await db.delete(paymentsTable).where(inArray(paymentsTable.roscaId, roscaIds));
    await db.delete(membersTable).where(inArray(membersTable.roscaId, roscaIds));
    await db.delete(roscasTable).where(eq(roscasTable.userId, userId));
  }
  res.status(204).end();
});

export default router;

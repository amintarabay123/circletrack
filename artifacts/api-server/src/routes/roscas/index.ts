import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
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

const router: IRouter = Router();

function parseId(raw: unknown): number | null {
  const n = parseInt(String(raw), 10);
  return isNaN(n) ? null : n;
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

function getCycleDueDate(startDate: string, frequency: string, cycle: number): string {
  const start = parseISO(startDate.slice(0, 10));
  let due: Date;
  if (frequency === "weekly") due = addWeeks(start, cycle);
  else if (frequency === "biweekly") due = addWeeks(start, cycle * 2);
  else if (frequency === "semimonthly") due = getSemimonthlyDate(startDate, cycle);
  else due = addMonths(start, cycle);
  return format(due, "yyyy-MM-dd");
}

function getCycleStartDate(startDate: string, frequency: string, cycle: number): string {
  if (frequency === "semimonthly") {
    if (cycle === 1) return startDate.slice(0, 10);
    return format(getSemimonthlyDate(startDate, cycle - 1), "yyyy-MM-dd");
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
router.get("/roscas", async (_req, res): Promise<void> => {
  const roscas = await db.select().from(roscasTable).orderBy(roscasTable.createdAt);
  res.json(roscas.map(formatRosca));
});

// Create a rosca
router.post("/roscas", async (req, res): Promise<void> => {
  const parsed = CreateRoscaBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [rosca] = await db.insert(roscasTable).values({
    name: parsed.data.name,
    startDate: parsed.data.startDate,
    frequency: parsed.data.frequency,
    contributionAmount: String(parsed.data.contributionAmount),
    totalCycles: parsed.data.totalCycles,
    currentCycle: 1,
    isActive: true,
  }).returning();
  res.status(201).json(formatRosca(rosca));
});

// Get a single rosca
router.get("/roscas/:id", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const [rosca] = await db.select().from(roscasTable).where(eq(roscasTable.id, id));
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
  res.json(formatRosca(rosca));
});

// Update a rosca
router.put("/roscas/:id", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateRoscaBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [rosca] = await db.update(roscasTable).set({
    name: parsed.data.name,
    startDate: parsed.data.startDate,
    frequency: parsed.data.frequency,
    contributionAmount: String(parsed.data.contributionAmount),
    totalCycles: parsed.data.totalCycles,
    currentCycle: parsed.data.totalCycles,
  }).where(eq(roscasTable.id, id)).returning();
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
  res.json(formatRosca(rosca));
});

// Advance rosca cycle
router.patch("/roscas/:id/advance", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const [rosca] = await db.select().from(roscasTable).where(eq(roscasTable.id, id));
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
  if (rosca.currentCycle >= rosca.totalCycles) {
    res.status(400).json({ error: "Already at final cycle" }); return;
  }
  const [updated] = await db.update(roscasTable)
    .set({ currentCycle: rosca.currentCycle + 1 })
    .where(eq(roscasTable.id, id)).returning();
  res.json(formatRosca(updated));
});

// Roll back rosca cycle by one
router.patch("/roscas/:id/rollback", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  const [rosca] = await db.select().from(roscasTable).where(eq(roscasTable.id, id));
  if (!rosca) { res.status(404).json({ error: "Rosca not found" }); return; }
  if (rosca.currentCycle <= 1) {
    res.status(400).json({ error: "Already at first cycle" }); return;
  }
  const [updated] = await db.update(roscasTable)
    .set({ currentCycle: rosca.currentCycle - 1 })
    .where(eq(roscasTable.id, id)).returning();
  res.json(formatRosca(updated));
});

// Delete a rosca
router.delete("/roscas/:id", async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(roscasTable).where(eq(roscasTable.id, id));
  res.sendStatus(204);
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
  const paymentByMember = new Map<number, { amount: number; paidAt: Date; isLate: boolean }>();
  for (const p of cyclePayments) {
    paymentByMember.set(p.memberId, { amount: parseFloat(p.amount), paidAt: p.paidAt, isLate: p.isLate });
  }
  const memberStatuses = members.map(m => {
    const amountDue = contributionAmount * m.shares;
    const payment = paymentByMember.get(m.id);
    return {
      memberId: m.id, memberName: m.name, shares: m.shares,
      amountDue, amountPaid: payment ? payment.amount : 0,
      isPaid: !!payment, isLate: payment ? payment.isLate : false,
      paidAt: payment ? payment.paidAt.toISOString() : null,
    };
  });
  const totalExpected = memberStatuses.reduce((sum, m) => sum + m.amountDue, 0);
  const totalCollected = memberStatuses.reduce((sum, m) => sum + m.amountPaid, 0);
  const paidCount = memberStatuses.filter(m => m.isPaid).length;
  const unpaidCount = memberStatuses.filter(m => !m.isPaid).length;
  const lateCount = memberStatuses.filter(m => m.isLate).length;
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
  const potMember = members.find(m => m.turnOrder === currentCycle) ?? members[currentCycle - 1] ?? null;
  res.json({
    rosca: formatRosca(rosca), currentCycle, cycleStartDate, cycleDueDate,
    totalExpected, totalCollected, collectionRate, paidCount, unpaidCount, lateCount,
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

export default router;

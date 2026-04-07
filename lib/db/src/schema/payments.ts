import { pgTable, text, serial, timestamp, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { roscasTable } from "./roscas";
import { membersTable } from "./members";

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  roscaId: integer("rosca_id").notNull().references(() => roscasTable.id, { onDelete: "cascade" }),
  memberId: integer("member_id").notNull().references(() => membersTable.id, { onDelete: "cascade" }),
  cycle: integer("cycle").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }).notNull(),
  dueDate: text("due_date").notNull(),
  isLate: boolean("is_late").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, createdAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;

import { pgTable, text, serial, timestamp, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roscasTable = pgTable("roscas", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  frequency: text("frequency").notNull(), // 'weekly' | 'biweekly' | 'semimonthly' | 'monthly'
  contributionAmount: numeric("contribution_amount", { precision: 10, scale: 2 }).notNull(),
  currentCycle: integer("current_cycle").notNull().default(1),
  totalCycles: integer("total_cycles").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRoscaSchema = createInsertSchema(roscasTable).omit({ id: true, createdAt: true });
export type InsertRosca = z.infer<typeof insertRoscaSchema>;
export type Rosca = typeof roscasTable.$inferSelect;

import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { roscasTable } from "./roscas";

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  roscaId: integer("rosca_id").notNull().references(() => roscasTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  shares: integer("shares").notNull().default(1), // 1=single, 2=double
  turnOrder: integer("turn_order"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMemberSchema = createInsertSchema(membersTable).omit({ id: true, createdAt: true });
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof membersTable.$inferSelect;

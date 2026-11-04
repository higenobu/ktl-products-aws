import { integer, sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  requestId: text("request_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull().default(""),
  product: text("product").notNull(),
  purpose: text("purpose").notNull(),
  deployment: text("deployment").notNull(),
  teamSize: text("team_size").notNull(),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("received"),
  consentVersion: text("consent_version").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [uniqueIndex("applications_user_request").on(table.userId, table.requestId), index("applications_user_date").on(table.userId,table.createdAt)]);

import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactGuard = sqliteTable("contact_guard", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ipHash: text("ip_hash").notNull(),
  contentHash: text("content_hash").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("contact_guard_ip_time_idx").on(table.ipHash, table.createdAt),
  index("contact_guard_content_time_idx").on(table.contentHash, table.createdAt),
  index("contact_guard_time_idx").on(table.createdAt),
]);

export const contentEntries = sqliteTable("content_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", { enum: ["note", "certification"] }).notNull(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  metadata: text("metadata").notNull().default("{}"),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: integer("published_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("content_entries_type_status_idx").on(table.type, table.status),
  index("content_entries_sort_idx").on(table.type, table.sortOrder),
]);

export const adminAudit = sqliteTable("admin_audit", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id"),
  createdAt: integer("created_at").notNull(),
});

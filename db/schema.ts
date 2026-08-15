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

import { env } from "cloudflare:workers";

export type ContentType = "note" | "certification";
export type ContentStatus = "draft" | "published";

export type ContentEntry = {
  id: number;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  body: string;
  metadata: string;
  status: ContentStatus;
  sortOrder: number;
  publishedAt: number | null;
  createdAt: number;
  updatedAt: number;
};

type D1Result<T> = { results?: T[] };
type D1Statement = { bind: (...values: unknown[]) => D1Statement; all: <T>() => Promise<D1Result<T>>; run: () => Promise<{ meta?: { last_row_id?: number } }> };
type D1Database = { prepare: (sql: string) => D1Statement };

function database() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error("D1 binding DB is not configured");
  return db;
}

function mapRow(row: Record<string, unknown>): ContentEntry {
  return {
    id: Number(row.id), type: row.type as ContentType, slug: String(row.slug), title: String(row.title),
    summary: String(row.summary), body: String(row.body), metadata: String(row.metadata),
    status: row.status as ContentStatus, sortOrder: Number(row.sort_order),
    publishedAt: row.published_at == null ? null : Number(row.published_at),
    createdAt: Number(row.created_at), updatedAt: Number(row.updated_at),
  };
}

export async function listContent(type?: ContentType, publishedOnly = false) {
  const clauses: string[] = [];
  const values: unknown[] = [];
  if (type) { clauses.push("type = ?"); values.push(type); }
  if (publishedOnly) clauses.push("status = 'published'");
  const where = clauses.length ? ` WHERE ${clauses.join(" AND ")}` : "";
  const statement = database().prepare(`SELECT * FROM content_entries${where} ORDER BY sort_order ASC, updated_at DESC`).bind(...values);
  const result = await statement.all<Record<string, unknown>>();
  return (result.results ?? []).map(mapRow);
}

export async function saveContent(input: Omit<ContentEntry, "id" | "createdAt" | "updatedAt" | "publishedAt"> & { id?: number }, actor: string) {
  const now = Date.now();
  const publishedAt = input.status === "published" ? now : null;
  let id = input.id;
  if (id) {
    await database().prepare("UPDATE content_entries SET type=?, slug=?, title=?, summary=?, body=?, metadata=?, status=?, sort_order=?, published_at=COALESCE(published_at, ?), updated_at=? WHERE id=?")
      .bind(input.type, input.slug, input.title, input.summary, input.body, input.metadata, input.status, input.sortOrder, publishedAt, now, id).run();
  } else {
    const result = await database().prepare("INSERT INTO content_entries (type, slug, title, summary, body, metadata, status, sort_order, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(input.type, input.slug, input.title, input.summary, input.body, input.metadata, input.status, input.sortOrder, publishedAt, now, now).run();
    id = Number(result.meta?.last_row_id);
  }
  await database().prepare("INSERT INTO admin_audit (actor, action, entity_type, entity_id, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(actor, input.id ? "update" : "create", input.type, id, now).run();
  return id;
}

export async function removeContent(id: number, actor: string) {
  const rows = await database().prepare("SELECT type FROM content_entries WHERE id=?").bind(id).all<{ type: string }>();
  const type = rows.results?.[0]?.type ?? "unknown";
  await database().prepare("DELETE FROM content_entries WHERE id=?").bind(id).run();
  await database().prepare("INSERT INTO admin_audit (actor, action, entity_type, entity_id, created_at) VALUES (?, 'delete', ?, ?, ?)")
    .bind(actor, type, id, Date.now()).run();
}

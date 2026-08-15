import { listContent, removeContent, saveContent, type ContentStatus, type ContentType } from "../../../../lib/content-store";
import { requireAdmin } from "../../../../lib/admin-auth";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(request: Request) {
  const identity = requireAdmin(request);
  if (!identity) return Response.json({ ok: false }, { status: 404 });
  return Response.json({ ok: true, entries: await listContent() });
}

export async function POST(request: Request) {
  const identity = requireAdmin(request);
  if (!identity) return Response.json({ ok: false }, { status: 404 });
  const body = await request.json() as Record<string, unknown>;
  const type = String(body.type) as ContentType;
  const status = String(body.status) as ContentStatus;
  const slug = String(body.slug ?? "").trim().toLowerCase();
  const title = String(body.title ?? "").trim().slice(0, 180);
  const summary = String(body.summary ?? "").trim().slice(0, 500);
  const content = String(body.body ?? "").trim().slice(0, 50000);
  const metadata = String(body.metadata ?? "{}").trim().slice(0, 5000);
  const sortOrder = Math.max(0, Math.min(9999, Number(body.sortOrder ?? 0)));

  if (!(["note", "certification"] as string[]).includes(type) || !(["draft", "published"] as string[]).includes(status) || !slugPattern.test(slug) || title.length < 2) {
    return Response.json({ ok: false, code: "VALIDATION_ERROR" }, { status: 400 });
  }
  try { JSON.parse(metadata); } catch { return Response.json({ ok: false, code: "INVALID_METADATA" }, { status: 400 }); }

  try {
    const id = await saveContent({ id: body.id ? Number(body.id) : undefined, type, status, slug, title, summary, body: content, metadata, sortOrder }, identity.email);
    return Response.json({ ok: true, id });
  } catch {
    return Response.json({ ok: false, code: "SAVE_FAILED" }, { status: 409 });
  }
}

export async function DELETE(request: Request) {
  const identity = requireAdmin(request);
  if (!identity) return Response.json({ ok: false }, { status: 404 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return Response.json({ ok: false }, { status: 400 });
  await removeContent(id, identity.email);
  return Response.json({ ok: true });
}

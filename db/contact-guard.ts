const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function checkContactGuard(request: Request, content: string) {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) return { allowed: false, code: "GUARD_UNAVAILABLE" } as const;

  const now = Date.now();
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const runtimeEnv = env as unknown as Record<string, unknown>;
  const salt = String(runtimeEnv.CONTACT_GUARD_SALT ?? "contact-guard-v1");
  const [ipHash, contentHash] = await Promise.all([digest(`${salt}:${ip}`), digest(content)]);

  const [hourly, daily, global, duplicate] = await env.DB.batch([
    env.DB.prepare("SELECT COUNT(*) AS count FROM contact_guard WHERE ip_hash = ? AND created_at >= ?").bind(ipHash, now - HOUR),
    env.DB.prepare("SELECT COUNT(*) AS count FROM contact_guard WHERE ip_hash = ? AND created_at >= ?").bind(ipHash, now - DAY),
    env.DB.prepare("SELECT COUNT(*) AS count FROM contact_guard WHERE created_at >= ?").bind(now - DAY),
    env.DB.prepare("SELECT COUNT(*) AS count FROM contact_guard WHERE content_hash = ? AND created_at >= ?").bind(contentHash, now - DAY),
  ]);

  const count = (result: D1Result) => Number((result.results?.[0] as {count?:number|string} | undefined)?.count ?? 0);
  if (count(hourly) >= 3) return { allowed: false, code: "HOURLY_LIMIT" } as const;
  if (count(daily) >= 10) return { allowed: false, code: "DAILY_LIMIT" } as const;
  if (count(global) >= 30) return { allowed: false, code: "GLOBAL_LIMIT" } as const;
  if (count(duplicate) >= 1) return { allowed: false, code: "DUPLICATE" } as const;

  await env.DB.batch([
    env.DB.prepare("INSERT INTO contact_guard (ip_hash, content_hash, created_at) VALUES (?, ?, ?)").bind(ipHash, contentHash, now),
    env.DB.prepare("DELETE FROM contact_guard WHERE created_at < ?").bind(now - (2 * DAY)),
  ]);
  return { allowed: true, code: "ALLOW" } as const;
}

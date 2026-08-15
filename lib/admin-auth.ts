import { env } from "cloudflare:workers";

export type AdminIdentity = { email: string };

export function requireAdmin(request: Request): AdminIdentity | null {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const allowedEmail = runtimeEnv.ADMIN_EMAIL?.trim().toLowerCase();
  const accessEmail = request.headers.get("cf-access-authenticated-user-email")?.trim().toLowerCase();

  // Fail closed. Cloudflare Access must protect /admin* and /api/admin*.
  if (!allowedEmail || !accessEmail || accessEmail !== allowedEmail) return null;
  return { email: accessEmail };
}

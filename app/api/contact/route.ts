import { checkContactGuard } from "../../../db/contact-guard";
import { env } from "cloudflare:workers";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return Response.json({ ok: false, code: "INVALID_CONTENT_TYPE" }, { status: 415 });

    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name ?? "").trim().slice(0, 80);
    const email = String(body.email ?? "").trim().slice(0, 160);
    const subject = String(body.subject ?? "").trim().slice(0, 120);
    const message = String(body.message ?? "").trim().slice(0, 3000);
    const website = String(body.website ?? "");
    const startedAt = Number(body.startedAt ?? 0);

    if (website) return Response.json({ ok: true });
    if (!startedAt || Date.now() - startedAt < 2500) return Response.json({ ok: false, code: "RATE_CHECK" }, { status: 429 });
    if (name.length < 2 || !emailPattern.test(email) || subject.length < 3 || message.length < 20) {
      return Response.json({ ok: false, code: "VALIDATION_ERROR" }, { status: 400 });
    }

    const runtimeEnv = env as unknown as Record<string, string | undefined>;
    const apiKey = runtimeEnv.RESEND_API_KEY;
    const destination = runtimeEnv.CONTACT_DESTINATION;
    const sender = runtimeEnv.CONTACT_SENDER;
    if (!apiKey || !destination || !sender) {
      return Response.json({ ok: false, code: "GATEWAY_NOT_CONFIGURED" }, { status: 503 });
    }

    const guard = await checkContactGuard(request, `${email.toLowerCase()}\n${subject.toLowerCase()}\n${message}`);
    if (!guard.allowed) {
      const duplicate = guard.code === "DUPLICATE";
      return Response.json({ ok: false, code: duplicate ? "DUPLICATE" : "RATE_LIMITED" }, { status: duplicate ? 409 : 429 });
    }

    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender,
        to: [destination],
        reply_to: email,
        subject: `[berkinyildiz.com] ${subject}`,
        text: `Name: ${name}\nReply address: ${email}\n\n${message}`,
      }),
    });

    if (!delivery.ok) return Response.json({ ok: false, code: "DELIVERY_FAILED" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, code: "INVALID_REQUEST" }, { status: 400 });
  }
}

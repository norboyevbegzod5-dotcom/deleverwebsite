import { NextRequest, NextResponse } from "next/server";
import { leadSchema, isQualified } from "@/lib/validation";
import { createAmoCrmLead, AmoCrmNotConfiguredError } from "@/lib/amocrm";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!isQualified(parsed.data)) {
    return NextResponse.json({ ok: false, error: "not_qualified" }, { status: 422 });
  }

  // Honeypot: bots that fill hidden fields get a fake success, no CRM call.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  try {
    await createAmoCrmLead(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AmoCrmNotConfiguredError) {
      console.warn("[lead] amoCRM not configured, logging lead instead:", parsed.data);
      return NextResponse.json({ ok: true, warning: "amocrm_not_configured" });
    }

    console.error("[lead] failed to push lead to amoCRM:", error, parsed.data);
    return NextResponse.json({ ok: false, error: "amocrm_error" }, { status: 502 });
  }
}

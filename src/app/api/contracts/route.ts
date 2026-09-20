import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createContract, listContracts, maxContractsForPlan, setContractError } from "@/lib/db";
import { runAnalysis } from "@/lib/analyze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ contracts: await listContracts(user.id) });
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const title = (typeof body?.title === "string" && body.title.trim()) || "Megnevezés nélküli szerződés";
  const filename = typeof body?.filename === "string" ? body.filename : null;
  const mode = body?.mode === "pre_sign" ? "pre_sign" : "post_sign";

  if (!text) return NextResponse.json({ error: "Nincs megadva szerződés szövege." }, { status: 400 });
  if (text.length < 40) {
    return NextResponse.json({ error: "A szerződés szövege túl rövid az elemzéshez." }, { status: 400 });
  }

  const plan = user.plan || "free";
  if ((await listContracts(user.id)).length >= maxContractsForPlan(plan)) {
    const msg =
      plan === "pro"
        ? "A Pro csomag 14 szerződést engedélyez. Frissíts Business csomagra (€16.90/hó) 15+ szerződéshez."
        : "Az ingyenes csomag 1 szerződést engedélyez. Frissíts Pro-ra (€6.90/hó) a további szerződésekhez.";
    return NextResponse.json({ error: msg }, { status: 402 });
  }

  const contract = await createContract({ user_id: user.id, title, filename, raw_text: text, mode });

  // Szinkron elemzés – a kérés megvárja, így Vercel-en is biztosan lefut.
  try {
    const summary = await runAnalysis(contract.id, user.id, text, mode, plan);
    return NextResponse.json({ id: contract.id, ...summary });
  } catch (err) {
    console.error("[analyze] failed:", err);
    await setContractError(contract.id, err instanceof Error ? err.message : "Az elemzés nem sikerült.");
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Az elemzés nem sikerült." },
      { status: 502 }
    );
  }
}

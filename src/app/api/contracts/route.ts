import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createContract, listContracts, setContractError } from "@/lib/db";
import { runAnalysis } from "@/lib/analyze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const contract = await createContract({ user_id: user.id, title, filename, raw_text: text, mode });

  // Analyze in the background so the request returns immediately; the report
  // page shows "Analyzing…" and polls until the contract status changes.
  void runAnalysis(contract.id, user.id, text, mode).catch((err) => {
    console.error("[analyze] background failed:", err);
    setContractError(contract.id, err instanceof Error ? err.message : "Az elemzés nem sikerült.");
  });

  return NextResponse.json({ id: contract.id, status: "analyzing" });
}

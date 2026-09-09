import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { clearContractError, getContract, setContractError, setContractStatus } from "@/lib/db";
import { runAnalysis } from "@/lib/analyze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const contract = await getContract(id);
  if (!contract || contract.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (contract.status === "analyzing") {
    return NextResponse.json({ id, status: "analyzing" });
  }

  await setContractStatus(id, "analyzing");
  await clearContractError(id);

  void runAnalysis(id, user.id, contract.raw_text, contract.mode).catch((err) => {
    console.error("[retry] failed:", err);
    void setContractError(id, err instanceof Error ? err.message : "Az elemzés nem sikerült.");
  });

  return NextResponse.json({ id, status: "analyzing" });
}

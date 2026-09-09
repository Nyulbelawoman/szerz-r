import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getContract, getFlags } from "@/lib/db";
import { generateLetter } from "@/lib/claude";

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

  const flags = (await getFlags(id)).map((f) => ({
    title: f.title,
    negotiationTip: f.negotiation_tip,
    moneyImpact: f.money_impact,
  }));

  const letter = await generateLetter(contract.raw_text, flags, contract.mode);
  return NextResponse.json({ letter });
}

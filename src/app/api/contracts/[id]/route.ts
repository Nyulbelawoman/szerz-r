import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { deleteContract, getContract, getDeadlines, getFlags } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
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

  return NextResponse.json({
    contract: {
      id: contract.id,
      title: contract.title,
      filename: contract.filename,
      status: contract.status,
      summary: contract.summary,
      overall_severity: contract.overall_severity,
      provider: contract.provider,
      mode: contract.mode,
      error: contract.error,
      created_at: contract.created_at,
    },
    flags: await getFlags(id),
    deadlines: await getDeadlines(id),
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const ok = await deleteContract(id, user.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

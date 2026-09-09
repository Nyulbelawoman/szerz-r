import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getContract, getDeadlineById, setDeadlineStatus } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deadline = await getDeadlineById(id);
  if (!deadline) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contract = await getContract(deadline.contract_id);
  if (!contract || contract.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status === "handled" ? "handled" : "open";
  await setDeadlineStatus(id, status as "open" | "handled");
  return NextResponse.json({ ok: true, status });
}

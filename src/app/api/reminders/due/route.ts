import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDeadlineById, getDueReminders } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dueReminders = await getDueReminders(user.id);
  const due = [];
  for (const r of dueReminders) {
    const d = await getDeadlineById(r.deadline_id);
    due.push({
      id: r.id,
      deadline_id: r.deadline_id,
      label: d?.label || "Határidő",
      act_by: d?.act_by_date || d?.date || null,
      tier_days: r.tier_days,
    });
  }

  return NextResponse.json({ due });
}

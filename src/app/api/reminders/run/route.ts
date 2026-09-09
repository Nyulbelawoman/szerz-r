import { NextResponse } from "next/server";
import { getDeadlineById, getDueRemindersAll, markReminderSent } from "@/lib/db";

export const runtime = "nodejs";

// Hit this endpoint daily (e.g. Vercel Cron, GitHub Actions, or a simple
// scheduler) to "send" any reminders that have come due.
export async function POST(req: Request) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const due = await getDueRemindersAll();
  const hasEmail = Boolean(process.env.SMTP_HOST);

  for (const r of due) {
    const d = await getDeadlineById(r.deadline_id);
    if (hasEmail) {
      // Production: send email via SMTP / Resend / Postmark here.
    }
    console.log(
      `[reminder] user=${r.user_id} deadline="${d?.label ?? r.deadline_id}" act-by="${d?.act_by_date ?? d?.date ?? "?"}" tier=${r.tier_days}d`
    );
    await markReminderSent(r.id);
  }

  return NextResponse.json({
    processed: due.length,
    deliveredVia: hasEmail ? "email" : "log",
  });
}

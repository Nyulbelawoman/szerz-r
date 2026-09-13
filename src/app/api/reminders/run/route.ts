import { NextResponse } from "next/server";
import { getDeadlineById, getDueRemindersAll, getUserById, markReminderSent } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.MAIL_FROM || "SzerzŐr <alerts@szerzor.com>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error("[resend] hiba:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[resend] kudarc:", err);
    return false;
  }
}

// Naponta hívd meg (cron-job.org), hogy kiküldje az esedékes emlékeztetőket.
// GET-et is elfogadunk, mert a cron-job.org alapból GET-tel hív.
export async function GET(req: Request) {
  return runReminders(req);
}

export async function POST(req: Request) {
  return runReminders(req);
}

async function runReminders(req: Request) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const due = await getDueRemindersAll();
  let sent = 0;

  for (const r of due) {
    const d = await getDeadlineById(r.deadline_id);
    const u = await getUserById(r.user_id);
    const label = d?.label || "Határidő";
    const actBy = d?.act_by_date || d?.date || "";

    let delivered = true;
    if (u?.email) {
      delivered = await sendEmail(
        u.email,
        `⏰ Határidő közeleg: ${label}`,
        `<div style="font-family:sans-serif;color:#1a1a1a;line-height:1.6">
          <h2 style="color:#0B1120">A SzerzŐr emlékezteti</h2>
          <p>Közeleg egy határidő a szerződéseiben:</p>
          <p style="font-size:18px;font-weight:bold;color:#B08A1E">${label}</p>
          <p>Teendő eddig: <strong>${actBy || "hamarosan"}</strong></p>
          <p style="color:#666">Ne felejtse el időben elintézni, hogy ne csússzon le.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
          <p style="color:#999;font-size:12px">A SzerzŐr segédlet, nem jogi tanácsadás.</p>
        </div>`
      );
      if (delivered) sent++;
    }

    // Csak akkor jelöljük elküldöttnek, ha tényleg kiment (vagy nincs email cím).
    if (delivered) {
      await markReminderSent(r.id);
    }
  }

  return NextResponse.json({ processed: due.length, sent });
}

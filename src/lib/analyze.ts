import {
  getContract,
  getUserById,
  insertDeadline,
  insertFlag,
  insertReminder,
  setContractError,
  setContractResult,
} from "./db";
import { analyzeWithClaude } from "./claude";
import { sendEmail } from "./email";
import { Severity } from "./types";

export const REMINDER_TIERS = [90, 60, 30, 14, 7, 4, 2, 1];

export function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

/** The effective "act by" date = the stated date minus the notice window. */
export function computeActByDate(
  date: string | null | undefined,
  noticeDays: number | null | undefined
): string | null {
  if (!date) return null;
  const base = new Date(date);
  if (isNaN(base.getTime())) return null;
  if (noticeDays != null && noticeDays > 0) {
    return addDays(base.toISOString(), -noticeDays);
  }
  return base.toISOString();
}

export async function scheduleReminders(deadlineId: string, userId: string, baseIso: string | null) {
  if (!baseIso || isNaN(new Date(baseIso).getTime())) return;
  const now = Date.now();
  for (const tier of REMINDER_TIERS) {
    const remindAt = addDays(baseIso, -tier);
    // Only schedule reminders that are still in the future.
    if (new Date(remindAt).getTime() > now) {
      await insertReminder({
        deadline_id: deadlineId,
        user_id: userId,
        remind_at: remindAt,
        tier_days: tier,
      });
    }
  }
}

export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export async function runAnalysis(
  contractId: string,
  userId: string,
  text: string,
  mode: string = "post_sign",
  plan: string = "free",
  images?: { data: string; mediaType: string }[]
) {
  const result = await analyzeWithClaude(text, mode, images);

  // If the contract was deleted while the analysis was running, stop here
  // so we don't re-insert orphaned flags/deadlines/reminders.
  if (!(await getContract(contractId))) return;

  if (result.provider === "error") {
    await setContractError(contractId, result.error || "Az elemzés nem sikerült.");
    throw new Error(result.error || "Az elemzés nem sikerült.");
  }

  let i = 0;
  for (const f of result.flags) {
    await insertFlag({
      contract_id: contractId,
      category: f.category,
      severity: f.severity,
      title: f.title,
      quoted_text: f.quotedText || null,
      explanation: f.explanation,
      negotiation_tip: f.negotiationTip || null,
      money_impact: f.moneyImpact || null,
      sort_order: i,
    });
    i++;
  }

  const nearDeadlines: { label: string; actBy: string; days: number }[] = [];

  for (const d of result.deadlines) {
    const actBy = computeActByDate(d.date, d.noticeDays);
    const deadlineId = await insertDeadline({
      contract_id: contractId,
      label: d.label,
      type: d.type,
      date: d.date || null,
      notice_days: d.noticeDays ?? null,
      act_by_date: actBy,
      source_text: d.sourceText || null,
      severity: d.severity,
    });
    if (mode === "post_sign") {
      await scheduleReminders(deadlineId, userId, actBy || d.date || null);
      // Gyűjtsük össze a közeli (7 napon belüli) határidőket az azonnali figyelmeztetéshez.
      const base = actBy || d.date || null;
      if (base && !isNaN(new Date(base).getTime())) {
        const days = daysUntil(base);
        if (days >= 0 && days <= 7) {
          nearDeadlines.push({ label: d.label, actBy: base, days });
        }
      }
    }
  }

  // Azonnali figyelmeztetés: ha van 7 napon belüli határidő, küldjünk egy összefoglaló emailt.
  if (nearDeadlines.length > 0) {
    try {
      const u = await getUserById(userId);
      if (u?.email) {
        nearDeadlines.sort((a, b) => a.days - b.days);
        const rows = nearDeadlines
          .map((d) => {
            const when = new Date(d.actBy).toLocaleDateString("hu-HU", {
              month: "long",
              day: "numeric",
            });
            return `<li style="margin:8px 0"><strong>${d.label}</strong> — teendő eddig: <strong>${when}</strong> (${d.days} nap)</li>`;
          })
          .join("");
        await sendEmail(
          u.email,
          "⏰ Közeli határidők a szerződésében",
          `<div style="font-family:sans-serif;color:#1a1a1a;line-height:1.6">
            <h2 style="color:#0B1120">A SzerzŐr figyelmezteti</h2>
            <p>A feltöltött szerződésében ezek a határidők <strong>egy héten belül</strong> esedékesek:</p>
            <ul style="padding-left:20px">${rows}</ul>
            <p style="color:#666">A pontos napokon további emlékeztetőket is küldünk (90, 60, 30, 14, 7, 4, 2, 1 nappal előtte).</p>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
            <p style="color:#999;font-size:12px">A SzerzŐr segédlet, nem jogi tanácsadás.</p>
          </div>`
        );
      }
    } catch (err) {
      console.error("[near-deadline] figyelmeztetés hiba:", err);
    }
  }

  await setContractResult(contractId, result.summary, result.overallSeverity, result.provider);
  return {
    summary: result.summary,
    overallSeverity: result.overallSeverity as Severity,
    flagCount: result.flags.length,
    deadlineCount: result.deadlines.length,
    provider: result.provider,
  };
}

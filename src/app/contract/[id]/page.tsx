import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getContract, getDeadlines, getFlags } from "@/lib/db";
import { daysUntil } from "@/lib/analyze";
import MarkHandledButton from "@/components/MarkHandledButton";
import PollAnalysis from "@/components/PollAnalysis";
import RetryButton from "@/components/RetryButton";
import LetterGenerator from "@/components/LetterGenerator";
import DeleteButton from "@/components/DeleteButton";
import { Severity } from "@/lib/types";

export const dynamic = "force-dynamic";

const sevStyle: Record<
  string,
  { badge: string; dot: string; border: string }
> = {
  critical: { badge: "bg-red-100 text-red-800", dot: "bg-red-600", border: "border-red-300" },
  high: { badge: "bg-orange-100 text-orange-800", dot: "bg-orange-500", border: "border-orange-300" },
  medium: { badge: "bg-amber-100 text-amber-800", dot: "bg-amber-500", border: "border-amber-300" },
  low: { badge: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-600", border: "border-emerald-300" },
  info: { badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400", border: "border-slate-300" },
};

const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("hu-HU", { month: "long", day: "numeric", year: "numeric" });
}

function daysBadge(days: number) {
  if (days <= 0)
    return { text: "Most esedékes", cls: "bg-red-600 text-white" };
  if (days <= 7)
    return { text: `${days} nap van hátra`, cls: "bg-red-100 text-red-800" };
  if (days <= 30)
    return { text: `${days} nap van hátra`, cls: "bg-amber-100 text-amber-800" };
  return { text: `${days} nap van hátra`, cls: "bg-slate-100 text-slate-700" };
}

function verdictFor(overall: string, flagCount: number) {
  if (overall === "critical" || flagCount >= 5)
    return {
      label: "Ne írja alá így",
      note: "Tárgyaljon keményen, vagy álljon el.",
      cls: "border-red-300 bg-red-50 text-red-800",
    };
  if (overall === "high" || flagCount >= 3)
    return {
      label: "Csak módosításokkal írja alá",
      note: "Először javíttassa a megjelölt pontokat.",
      cls: "border-amber-300 bg-amber-50 text-amber-800",
    };
  return {
    label: "Elfogadhatónak tűnik",
    note: "Kisebb pontok – aláírás előtt nézze át.",
    cls: "border-emerald-300 bg-emerald-50 text-emerald-800",
  };
}

export default async function ContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/signin");
  const { id } = await params;

  const contract = await getContract(id);
  if (!contract || contract.user_id !== user.id) notFound();

  const flags = await getFlags(id);
  const deadlines = await getDeadlines(id);
  const provider = contract.provider || "demo";
  const mode = contract.mode || "post_sign";
  const analyzing = contract.status === "analyzing";
  const financialFlags = flags.filter((f) => f.money_impact);

  const overall =
    flags.reduce<string>((worst, f) => (order[f.severity] < order[worst] ? f.severity : worst), "low") ||
    "low";

  const verdict =
    mode === "pre_sign" && provider === "claude" ? verdictFor(overall, flags.length) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PollAnalysis status={contract.status} />
      <Link href="/dashboard" className="text-sm font-medium text-brand-600 hover:underline">
        ← Vissza az irányítópultra
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{contract.title}</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Elemezve: {fmtDate(contract.created_at)}
            {contract.filename ? ` · ${contract.filename}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
            {mode === "pre_sign" ? "Aláírás előtt" : "Már aláírva"}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              analyzing
                ? "bg-slate-100 text-slate-500"
                : provider === "claude"
                ? sevStyle[overall].badge
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {analyzing ? "Elemzés…" : provider === "claude" ? `${overall} kockázat` : "nem ellenőrzött"}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              analyzing
                ? "bg-slate-100 text-slate-600"
                : provider === "claude"
                ? "bg-emerald-100 text-emerald-800"
                : provider === "error"
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {analyzing
              ? "Folyamatban"
              : provider === "claude"
              ? "Elemzés"
              : provider === "error"
              ? "Sikertelen"
              : "Demó"}
          </span>
        </div>
      </div>

      {verdict && (
        <div className={`mt-5 flex items-start gap-3 rounded-xl border-2 p-5 ${verdict.cls}`}>
          <span className="text-2xl">🧭</span>
          <div>
            <h2 className="text-lg font-bold">{verdict.label}</h2>
            <p className="mt-0.5 text-sm opacity-90">{verdict.note}</p>
          </div>
        </div>
      )}

      {contract.status === "error" ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <div className="min-w-0 flex-1">
            <strong>Az elemzés nem sikerült.</strong>{" "}
            {contract.error || "Az elemzés nem tudott befejeződni. Próbálja újra."}
          </div>
          <RetryButton contractId={id} />
        </div>
      ) : !analyzing && provider !== "claude" ? (
        <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Demó mód – korlátozott kulcsszavas vizsgálat.</strong> Nincs{" "}
          <code className="font-mono">ANTHROPIC_API_KEY</code> beállítva, ezért ez csak egy egyszerű,
          angol nyelvű vizsgálat volt, amely <em>a legtöbb csapdát kihagyja, és nem tud magyar nyelvű
          szerződést elemezni</em>. Adja meg a kulcsát a <code className="font-mono">.env.local</code>{" "}
          fájlban, és indítsa újra a teljes elemzéshez.
        </div>
      ) : null}

      {contract.status === "analyzing" && (
        <div className="card mt-6 flex items-center gap-2 p-5 text-sm text-slate-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
          Elemzés folyamatban…
        </div>
      )}

      {/* Summary */}
      {contract.summary && (
        <div className="card mt-6 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <span className={`h-2.5 w-2.5 rounded-full ${sevStyle[overall].dot}`} />
            Összefoglaló
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{contract.summary}</p>
        </div>
      )}

      {/* Financial summary */}
      {financialFlags.length > 0 && (
        <div className="card mt-6 p-5">
          <h3 className="text-sm font-semibold text-slate-900">💰 Pénzügyi hatás</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {financialFlags.map((f) => (
              <div key={f.id} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-medium text-emerald-700">{f.title}</p>
                <p className="mt-0.5 text-sm font-bold text-emerald-900">{f.money_impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red flags */}
      <h2 className="mt-9 text-lg font-semibold text-slate-900">
        {mode === "pre_sign" ? "Mit tárgyaljon meg aláírás előtt" : "Kockázatok"}{" "}
        <span className="text-sm font-normal text-slate-400">({flags.length})</span>
      </h2>
      {flags.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">
          {provider === "claude"
            ? "No red flags detected. (Remember: this is a review aid, not a guarantee.)"
            : "The limited demo scan found no flags — but it cannot reliably analyze this contract (especially non-English text). Add your ANTHROPIC_API_KEY for real results."}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {flags.map((f) => {
            const s = sevStyle[f.severity] || sevStyle.info;
            return (
              <div key={f.id} className={`card border-l-4 p-5 ${s.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <h3 className="font-semibold text-slate-900">{f.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${s.badge}`}>
                    {f.severity}
                  </span>
                </div>
                {f.quoted_text && (
                  <blockquote className="quote">{f.quoted_text}</blockquote>
                )}
                <p className="mt-2 text-sm text-slate-700">{f.explanation}</p>
                {f.money_impact && (
                  <p className="mt-2 text-sm font-semibold text-emerald-700">💰 {f.money_impact}</p>
                )}
                {f.negotiation_tip && (
                  <p className="mt-2 text-sm text-slate-700">
                    <span className="font-medium text-slate-900">
                      {mode === "pre_sign" ? "Mit tárgyaljon meg: " : "Mi a teendő: "}
                    </span>
                    {f.negotiation_tip}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {mode === "pre_sign" && provider === "claude" && flags.length > 0 && (
        <LetterGenerator contractId={id} mode={mode} />
      )}

      {/* Deadlines */}
      <h2 className="mt-9 text-lg font-semibold text-slate-900">
        {mode === "pre_sign" ? "Határidők aláírás után" : "Határidők"}{" "}
        <span className="text-sm font-normal text-slate-400">({deadlines.length})</span>
      </h2>
      {mode === "pre_sign" && deadlines.length > 0 && (
        <p className="mt-1.5 text-sm text-slate-500">Ha aláír, ezek a határidők lesznek érvényesek.</p>
      )}
      {deadlines.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Nem találtunk dátumot vagy felmondási időt.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {deadlines.map((d) => {
            const target = d.act_by_date || d.date;
            const days = target ? daysUntil(target) : null;
            const badge = days !== null ? daysBadge(days) : null;
            const handled = d.status === "handled";
            return (
              <li
                key={d.id}
                className={`card flex items-center justify-between gap-4 p-4 ${handled ? "opacity-60" : ""}`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-medium text-slate-900 ${handled ? "line-through" : ""}`}>
                      {d.label}
                    </h3>
                    {badge && !handled && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {d.notice_days ? `${d.notice_days} napos felmondási idő szükséges` : d.type}
                    {target ? ` · teendő eddig: ${fmtDate(target)}` : " · dátum nincs megadva – adja meg, amikor tudja"}
                  </p>
                  {d.source_text && (
                    <blockquote className="quote mt-2">{d.source_text}</blockquote>
                  )}
                </div>
                <MarkHandledButton deadlineId={d.id} handled={handled} />
              </li>
            );
          })}
        </ul>
      )}

      {mode === "post_sign" && provider === "claude" && (flags.length > 0 || deadlines.length > 0) && (
        <LetterGenerator contractId={id} mode={mode} />
      )}

      <p className="mt-10 rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-500">
        <strong>A SzerzŐr nem jogi tanácsadás.</strong> Ezek a jelzések automatikus elemzésen alapuló
        kiindulópontok. Olvassa el a tényleges szerződést, és fontos döntésekhez kérjen ügyvédi
        segítséget.
      </p>

      <div className="mt-4 text-center">
        <DeleteButton contractId={id} />
      </div>
    </div>
  );
}

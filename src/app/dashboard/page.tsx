import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { listContracts, listUpcomingDeadlines } from "@/lib/db";
import { daysUntil } from "@/lib/analyze";

export const dynamic = "force-dynamic";

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signin");
  const contracts = await listContracts(user.id);
  const upcoming = await listUpcomingDeadlines(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Az Ön szerződései</h1>
          <p className="text-sm text-slate-600">
            Bejelentkezve mint <span className="font-medium">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user.plan === "free" ? (
            <Link
              href={process.env.GUMROAD_CHECKOUT_URL || "/signup"}
              target="_blank"
              rel="noopener"
              className="btn-ghost"
            >
              Frissítés Próra
            </Link>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Pró
            </span>
          )}
          <Link href="/upload" className="btn-primary">
            + Új elemzés
          </Link>
        </div>
      </div>

      {/* Előfizetés kezelése */}
      {user.plan === "pro" && (
        <section className="card mt-8 flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">💎 Pro előfizetés</h2>
            <p className="mt-0.5 text-sm text-slate-600">
              Aktív — a határidő-emlékeztetők és a korlátlan elemzés be van kapcsolva.
            </p>
          </div>
          <a
            href={
              user.gumroad_subscription_id
                ? `https://app.gumroad.com/subscriptions/${user.gumroad_subscription_id}/manage`
                : "https://app.gumroad.com/library"
            }
            target="_blank"
            rel="noopener"
            className="btn-ghost"
          >
            Előfizetés kezelése / lemondás
          </a>
        </section>
      )}

      {/* Határidő-naptár */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">📅 Közelgő határidők</h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Nincs közelgő határidő.</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {upcoming.map((u) => {
              const target = u.act_by_date || u.date;
              const days = target ? daysUntil(target) : null;
              return (
                <li key={u.deadline_id}>
                  <Link
                    href={`/contract/${u.contract_id}`}
                    className="card flex items-center justify-between gap-3 p-3 transition hover:border-brand-500"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{u.label}</p>
                      <p className="truncate text-xs text-slate-500">
                        {u.contract_title} · {target ? fmtDate(target) : ""}
                      </p>
                    </div>
                    {days !== null && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          days <= 7
                            ? "bg-red-100 text-red-800"
                            : days <= 30
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {days <= 0 ? "Lejárt" : `${days} nap`}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {contracts.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <div className="text-4xl">📄</div>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">Még nincs szerződés</h2>
          <p className="mt-1 text-sm text-slate-600">
            Töltsön fel egy bérleti szerződést, tagsági szerződést vagy megállapodást, és feltárjuk a
            csapdákat, valamint figyeljük a határidőket.
          </p>
          <Link href="/upload" className="btn-primary mt-5">
            Első szerződés elemzése
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {contracts.map((c) => {
            const dueIn = c.next_act_by ? daysUntil(c.next_act_by) : null;
            const urgent = dueIn !== null && dueIn <= 14;
            return (
              <li key={c.id}>
                <Link
                  href={`/contract/${c.id}`}
                  className="card block p-5 transition hover:border-brand-500 hover:shadow"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">{c.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Elemezve: {fmtDate(c.created_at)}
                        {c.status === "analyzing" && " · elemzés…"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-sm">
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                        {c.flag_count} csapda
                      </span>
                      {dueIn !== null && (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            urgent ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {dueIn <= 0
                            ? "Most esedékes"
                            : `Következő teendő: ${dueIn} nap (${fmtDate(c.next_act_by)})`}
                        </span>
                      )}
                      {c.open_deadline_count === 0 && c.flag_count > 0 && (
                        <span className="text-xs text-slate-400">nincs nyitott határidő</span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

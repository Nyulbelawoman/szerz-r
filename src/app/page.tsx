import Link from "next/link";

const features = [
  {
    icon: "📅",
    title: "Határidő-kinyerés",
    body: "Kiszedjük a szerződésből az összes dátumot — a rejtetteket is: felmondási ablak, automatikus megújulás, díjemelés, próbaidő vége.",
  },
  {
    icon: "⏰",
    title: "Automatikus emlékeztetők",
    body: "E-mailben szólunk 90, 60, 30, 14, 7, 3 és 1 nappal előtte, hogy időben léphess, ne utólag.",
  },
  {
    icon: "🗂️",
    title: "Egy helyen az összes szerződésed",
    body: "Bérlet, konditerem, telefon, biztosítás, SaaS-előfizetés — tedd ide, és a SzerzŐr mindet figyeli.",
  },
  {
    icon: "🚩",
    title: "Csapda-azonosítás",
    body: "Megmutatjuk, miért fontos az adott határidő — milyen csapda van mögötte, és mit tehetsz ellene.",
  },
  {
    icon: "💰",
    title: "Pénzügyi hatás",
    body: "Látod, mennyibe kerül, ha elmulasztasz egy határidőt — a számok motiválnak.",
  },
  {
    icon: "🔒",
    title: "Privát és a tiéd",
    body: "A szerződéseid a tieid maradnak. Nem adjuk el, nem tanulunk belőlük, és bármikor törölheted.",
  },
];

const steps = [
  { n: "1", title: "Tedd be a szerződésed", body: "Illeszd be, tölts fel PDF-et, vagy továbbítsd emailben." },
  { n: "2", title: "Kinyerjük a határidőket", body: "A rejtetteket is: felmondási ablak, megújulás, díjemelés." },
  { n: "3", title: "Időben szólunk", body: "Emlékeztetünk minden fontos nap előtt — soha nem csúszol le." },
];

const tiers = [
  {
    name: "Ingyenes",
    price: "0",
    tagline: "Próbáld ki",
    features: [
      "1 szerződés",
      "Alap elemzés",
      "Nincs emlékeztető",
    ],
    cta: "Kezdd ingyen",
    highlight: false,
  },
  {
    name: "Pro",
    price: "3 990 Ft",
    tagline: "Figyeljük minden határidőd",
    features: [
      "Korlátlan szerződés",
      "Határidő-kinyerés + emlékeztetők",
      "E-mail értesítések",
      "PDF-feltöltés",
      "Pénzügyi hatás",
      "Tárgyalási levél",
    ],
    cta: "Válaszd a Prót",
    highlight: true,
  },
];

function HeroMock() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand-100 via-white to-accent-50 opacity-70 blur-xl" />
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">📅 Közelgő határidők</p>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700">
            SzerzŐr
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3">
            <div>
              <p className="text-xs font-semibold text-slate-800">🏋️ Konditerem</p>
              <p className="text-[11px] text-slate-500">Felmondj márc. 3-ig (30 napos ablak)</p>
            </div>
            <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">
              12 nap
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div>
              <p className="text-xs font-semibold text-slate-800">🏠 Albérlet</p>
              <p className="text-[11px] text-slate-500">Megújul máj. 2 — felmondj 60 nappal előtte</p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              70 nap
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-xs font-semibold text-slate-800">📱 Telefon</p>
              <p className="text-[11px] text-slate-500">Akciós ár vége jún. 15</p>
            </div>
            <span className="shrink-0 rounded-full bg-slate-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              114 nap
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-xs font-medium text-brand-700">
          <span>🔔</span> E-mailben is szólunk 30, 14, 7, 3 és 1 nappal előtte
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const checkoutUrl = process.env.GUMROAD_CHECKOUT_URL || "/signup";

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="hero-grid absolute inset-0 -z-10" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-gradient-to-b from-brand-50 via-white/60 to-transparent" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Szerződés-határidő figyelő
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Soha ne felejts el egyetlen <span className="text-gradient">határidőt</span> sem.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              Tedd ide a bérleti szerződésed, a konditermi tagságod, a telefonod, a biztosításod. A{" "}
              <span className="font-semibold text-slate-800">SzerzŐr</span> kinyeri a rejtett
              határidőket, kiszámolja a valódi teendő-dátumot, és időben emlékeztet — mielőtt
              automatikusan levonnak vagy meghosszabbodik.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Tedd be az első szerződésed
              </Link>
              <Link href="/signin" className="btn-ghost px-6 py-3 text-base">
                Bejelentkezés
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Ingyenes első szerződés · Nincs szükség bankkártyára · Nem jogi tanácsadás
            </p>
          </div>
          <HeroMock />
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hogyan használod?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Mindegy, hogy aláírás előtt állsz, vagy már aláírtad — a SzerzŐr mindkettőben segít.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card p-7">
            <div className="text-3xl">✍️</div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Aláírás előtt állok</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Nézd meg, mit írsz alá — a SzerzŐr megmutatja a csapdákat és a valódi költséget{" "}
              <i>mielőtt</i> elköteleződsz.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
              <li>✓ Aláírási ajánlás (írd alá / módosítsd / ne írd alá)</li>
              <li>✓ Mit tárgyalj meg előre</li>
              <li>✓ Pénzügyi hatás</li>
            </ul>
          </div>
          <div className="card p-7">
            <div className="text-3xl">🗂️</div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Már aláírtam</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Tedd be, amit aláírtál, és a SzerzŐr <b>figyeli a határidőidet</b>, és időben szól.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
              <li>✓ Rejtett határidők kinyerése</li>
              <li>✓ E-mail emlékeztetők minden fontos nap előtt</li>
              <li>✓ Lemondási és felmondási ablakok</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Minden, amire a határidőid figyeléséhez kell
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Nem egy újabb naptár — a SzerzŐr kinyeri a határidőket a szerződésből, és megmondja,
              miért fontosak.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card p-6 transition hover:shadow-card">
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hogyan működik</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">Három lépés, egy perc alatt.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="card p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Egyszerű ár</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Kezdd ingyen. A Pro figyeli a határidőidet, és időben szól.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`card relative p-7 ${t.highlight ? "ring-2 ring-brand-600" : ""}`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Ajánlott
                  </span>
                )}
                <h3 className="font-semibold text-slate-900">{t.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{t.tagline}</p>
                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  {t.price}
                  {t.price !== "0" && <span className="text-base font-normal text-slate-400">/hó</span>}
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-brand-600">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={t.name === "Ingyenes" ? "/signup" : checkoutUrl}
                  target={t.name === "Ingyenes" ? undefined : "_blank"}
                  rel={t.name === "Ingyenes" ? undefined : "noopener"}
                  className={`mt-7 w-full ${t.highlight ? "btn-primary" : "btn-ghost"}`}
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-slate-400">
            A fizetést biztonságosan a Gumroad kezeli.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="card overflow-hidden p-10 text-center sm:p-14">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Ne hagyd, hogy lecsússzon egy határidő.
            </h2>
            <p className="mt-3 text-slate-600">
              Tedd be az első szerződésed ingyen — a SzerzŐr elvégzi a többit.
            </p>
            <Link href="/signup" className="btn-primary mt-6 px-7 py-3 text-base">
              Tedd be az első szerződésed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

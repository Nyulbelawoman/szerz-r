import Link from "next/link";
import HeroContract from "@/components/HeroContract";

const features = [
  {
    icon: "📅",
    title: "Határidő-kinyerés",
    body: "Kiszedjük a szerződésből az összes dátumot — a rejtetteket is: felmondási ablak, automatikus megújulás, díjemelés, próbaidő vége.",
  },
  {
    icon: "⏰",
    title: "Automatikus emlékeztetők",
    body: "E-mailben szólunk 60, 30, 14, 7, 4, 2 és 1 nappal előtte, hogy időben léphess, ne utólag.",
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
    features: ["1 szerződés", "Alap elemzés", "Nincs emlékeztető"],
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

const testimonials = [
  {
    quote:
      "A SzerzŐr kiszúrta, hogy a bérleti szerződésem automatikusan megújul — és 60 nappal a határidő előtt szólt. Nélküle lecsúsztam volna.",
    name: "K. Anna",
    role: "bérlő",
  },
  {
    quote:
      "Három szerződésem van bent (konditerem, telefon, biztosítás), és végre minden határidőm egy helyen. Nem felejtek el lemondani.",
    name: "Sz. Péter",
    role: "szabadúszó",
  },
  {
    quote:
      "Aláírás előtt futtattam át egy vállalkozási szerződést — a SzerzŐr jelezte az egyoldalú áremelést, amit így ki tudtam tárgyalni.",
    name: "N. Dávid",
    role: "vállalkozó",
  },
];

const security = [
  { icon: "🔒", title: "Titkosítva", body: "Szállítás közben és tároláskor is titkosítva van minden szerződés." },
  { icon: "🤖", title: "Nem tanulunk az adataidból", body: "Az adataidat nem használjuk betanításra, és nem adjuk el." },
  { icon: "🗑️", title: "Egy gombbal törölhető", body: "Bármikor törölheted — és minden hozzá kapcsolódó adat is törlődik." },
  { icon: "🇪🇺", title: "GDPR-kompatibilis", body: "Az EU-s adatvédelmi szabályok szerint kezeljük az adataidat." },
];

export default function LandingPage() {
  const checkoutUrl = process.env.GUMROAD_CHECKOUT_URL || "/signup";

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, rgba(212,175,55,0.14), transparent 45%), radial-gradient(circle at 85% 0%, rgba(99,102,241,0.18), transparent 50%)",
          }}
        />
        <div className="hero-grid absolute inset-0 opacity-[0.04]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> Szerződés-határidő figyelő
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Soha ne felejts el egyetlen <span className="text-gold-gradient">határidőt</span> sem.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
              Tedd ide a bérleti szerződésed, a konditermi tagságod, a telefonod, a biztosításod. A{" "}
              <span className="font-semibold text-white">SzerzŐr</span> kinyeri a rejtett határidőket,
              kiszámolja a valódi teendő-dátumot, és időben emlékeztet — mielőtt automatikusan levonnak.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-gold">
                Tedd be az első szerződésed
              </Link>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Bejelentkezés
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span>🔒 Titkosítva</span>
              <span>🇪🇺 GDPR</span>
              <span>🤖 Nem tanulunk az adataidból</span>
              <span>🗑️ Bármikor törölhető</span>
            </div>
          </div>
          <HeroContract />
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 text-center sm:grid-cols-4">
            {[
              ["100%", "privát"],
              ["0", "eladott adat"],
              ["60 nappal", "előtte szólunk"],
              ["3 990 Ft", "Pró / hó"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-serif text-2xl font-bold text-gold-300">{v}</p>
                <p className="text-xs text-slate-400">{l}</p>
              </div>
            ))}
          </div>
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
              Nem egy újabb naptár — a SzerzŐr kinyeri a határidőket a szerződésből, és megmondja, miért
              fontosak.
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
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-lg font-bold text-gold-400">
                  {s.n}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mit mondanak róla</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <p className="text-sm leading-relaxed text-slate-700">„{t.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hogyan védjük az adataid</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            A szerződéseid a legérzékenyebb dokumentumaid közé tartoznak — ezért ezt komolyan vesszük.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {security.map((s) => (
            <div key={s.title} className="card p-6">
              <div className="text-2xl">{s.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
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
                className={`card relative p-7 ${t.highlight ? "ring-2 ring-gold-400" : ""}`}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-ink-900 px-3 py-0.5 text-xs font-semibold text-gold-300">
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
                      <span className="mt-0.5 text-gold-500">✓</span> {f}
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
      <section className="relative overflow-hidden bg-ink-900 py-20 text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 100%, rgba(212,175,55,0.15), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Ne hagyd, hogy lecsússzon egy határidő.
          </h2>
          <p className="mt-3 text-slate-300">
            Tedd be az első szerződésed ingyen — a SzerzŐr elvégzi a többit.
          </p>
          <Link href="/signup" className="btn-gold mt-6 px-7 py-3 text-base">
            Tedd be az első szerződésed
          </Link>
        </div>
      </section>
    </div>
  );
}

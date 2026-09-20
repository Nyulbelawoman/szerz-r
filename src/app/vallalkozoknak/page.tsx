import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Szerződés-határidők kisvállalkozóknak – SzerzŐr",
  description:
    "A SzerzŐr kinyeri a szerződéseidből a felmondási, megújítási és áremelési határidőket, és időben szól. Kisvállalkozóknak és egyéni vállalkozóknak.",
};

const pains = [
  {
    icon: "💸",
    title: "Az elfeledett havi díjak",
    body: "A céged 15–30 előfizetést fizet havonta — szoftverek, biztosítások, szolgáltatások. Mind automatikusan megújul, és ha nem mondod le időben, tovább vonják. A SzerzŐr kinyeri a lemondási határidőket, és szól, mielőtt újra lehúznak.",
    stat: "„Az elfeledett előfizetések a kiscégek csendes pénzszivárgása.”",
  },
  {
    icon: "🏢",
    title: "A 90 napos felmondási ablak",
    body: "Az iroda, az üzlethelyiség, a raktár bérleti szerződése felmondási idővel működik — jellemzően 30, 60 vagy 90 nap. Ha lecsúszol a napról, még egy évig fizeted, akkor is, ha már elköltöznél. A SzerzŐr pontosan tudja ezt a napot.",
    stat: "„A bérbeadó tudja a határidőt. Te is tudod? Mi igen.”",
  },
  {
    icon: "📈",
    title: "A csendes áremelés",
    body: "A beszállítói és szolgáltatói szerződések megújuláskor gyakran automatikusan drágulnak — inflációkövetéssel vagy indexálással. A megújítás előtt meghatározott nappal kell jelezned, ha nem kérsz belőle. A SzerzŐr figyeli ezt a napot helyetted.",
    stat: "„12% évente, némán. Csak akkor nem, ha időben szólsz.”",
  },
];

const steps = [
  { icon: "📄", title: "Tedd be", body: "PDF, beillesztett szöveg vagy akár fénykép — mindegy." },
  { icon: "🔍", title: "Kinyerjük", body: "A határidőket, felmondási időket és csapdákat." },
  { icon: "⏰", title: "Szólunk", body: "90, 60, 30, 14, 7, 4, 2, 1 nappal a határidő előtt." },
];

export default function VallalkozoknakPage() {
  const checkoutUrl = process.env.GUMROAD_CHECKOUT_URL || "/signup";

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-300">
            Kisvállalkozóknak és egyéni vállalkozóknak
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            A szerződéseid nem figyelik magukat.{" "}
            <span className="text-gold-400">Mi igen.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">
            Egyedül viszed a céget. A határidők nem várhatnak rád. A SzerzŐr kinyeri a szerződéseidből
            a felmondási, megújítási és áremelési határidőket — és időben szól.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Tedd be az első szerződésed
            </Link>
            <a
              href="#fajdalmak"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Nézd meg, mit fogsz ki
            </a>
          </div>
        </div>
      </section>

      {/* 3 fájdalom */}
      <section id="fajdalmak" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Három hely, ahol a céged csendben veszít pénzt
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pains.map((p) => (
            <div key={p.title} className="card flex flex-col p-7">
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{p.body}</p>
              <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-medium italic text-slate-500">
                {p.stat}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hogyan működik */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Három lépés, és soha többé nem csúszol le
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="card p-7 text-center">
                <div className="text-3xl">{s.icon}</div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {i + 1}. lépés
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ár */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Egyetlen ár</h2>
        <p className="mt-3 text-slate-600">Ennyiért nem érdemes határidőket fejben tartani.</p>
        <div className="card mx-auto mt-10 max-w-sm p-8 ring-2 ring-gold-400">
          <h3 className="font-semibold text-slate-900">Pro</h3>
          <p className="mt-1 text-sm text-slate-500">Korlátlan szerződés + emlékeztetők</p>
          <p className="mt-4 text-4xl font-bold text-slate-900">
            2 499 Ft<span className="text-base font-normal text-slate-400">/hó</span>
          </p>
          <Link href={checkoutUrl} target="_blank" rel="noopener" className="btn-primary mt-6 w-full">
            Kezdés most
          </Link>
        </div>
      </section>

      {/* Bizalom */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Őszintén rólunk</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Fiatal szolgáltatás vagyunk, ezért nem mutatunk kitalált véleményeket. Amit garantálunk:
            a szerződéseidet <strong>titkosítva tároljuk</strong>, a határidőket{" "}
            <strong>90 nappal előtte</strong> jelezzük, és bármikor egy gombbal törölheted az egészet.
          </p>
        </div>
      </section>

      {/* Záró CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-900">
          A határidő nem vár rád. A SzerzŐr szól.
        </h2>
        <p className="mt-4 text-slate-600">
          Tedd be a szerződéseidet — mi kinyerjük a dátumokat, és emlékeztetünk, mielőtt lecsúsznál.
        </p>
        <Link href="/signup" className="btn-primary mt-8 px-8 py-3 text-base">
          Kezdd el ingyen
        </Link>
        <p className="mt-6 text-xs text-slate-400">
          A SzerzŐr segédlet, nem jogi tanácsadás. Fontos döntések előtt kérjen ügyvédi segítséget.
        </p>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gyakori kérdések (GYIK) – SzerzŐr",
};

const faqs = [
  {
    q: "Hogyan működik a SzerzŐr?",
    a: "Feltölti vagy beilleszti a szerződését, és a SzerzŐr kinyeri belőle a határidőket (felmondás, megújítás, lejárat, fizetés stb.), majd e-mailben emlékezteti Önt a megfelelő időpontokban (90, 60, 30, 14, 7, 4, 2, 1 nappal előtte).",
  },
  {
    q: "Mi a különbség az Ingyenes és a Pro csomag között?",
    a: "Az Ingyenes csomaggal 1 szerződést elemezhet, emlékeztetők nélkül. A Pro (2 499 Ft/hó) korlátlan szerződést, határidő-kinyerést és e-mail emlékeztetőket, valamint PDF-feltöltést biztosít.",
  },
  {
    q: "Biztonságban vannak a szerződéseim?",
    a: "Igen. A szerződéseit szállítás közben és tároláskor is titkosítva kezeljük, nem adjuk el, és nem osztjuk meg harmadik féllel. Az adatait nem használjuk betanításra. Bármikor egy gombbal törölheti őket.",
  },
  {
    q: "Ez jogi tanácsadás?",
    a: "Nem. A SzerzŐr automatikus elemzésen alapuló tájékoztatást ad, amely segít észrevenni a fontos pontokat és határidőket — de nem helyettesíti ügyvéd tanácsát. Fontos döntések előtt kérjen jogi segítséget.",
  },
  {
    q: "Hogyan mondhatom le az előfizetésemet?",
    a: "Az irányítópultján a Pro kártyánál az „Előfizetés lemondása” gombra kattintva. A lemondás a Gumroadon történik (ott fut a számlázás), és a lemondás után a Pro hozzáférése automatikusan megszűnik. A már kifizetett időszakra visszamenőleges jóváírást nem tudunk adni.",
  },
  {
    q: "Van elállási jog?",
    a: "Fogyasztóként 14 napon belül indokolás nélkül elállhat. Mivel azonban a Pro szolgáltatás a vásárlással azonnal elérhetővé válik (digitális tartalom azonnali teljesítése), a vásárlással hozzájárul az azonnali teljesítéshez, és ezzel elveszíti az elállási jogát. Részletek az ÁSZF-ben.",
  },
  {
    q: "Milyen szerződésekkel működik?",
    a: "Bérleti szerződésekkel, tagsági- és előfizetéses szerződésekkel, szolgáltatási és megbízási szerződésekkel, munka- és vállalkozási szerződésekkel — gyakorlatilag bármilyen magyar nyelvű dokumentummal, amely határidőket és feltételeket tartalmaz.",
  },
  {
    q: "Kaphatok számlát?",
    a: "A fizetés a Gumroadon keresztül történik, ahol a vásárlásról bizonylatot kap. A Gumroad saját számlázási folyamatát alkalmazza.",
  },
];

export default function GyikPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-slate-900">Gyakori kérdések</h1>
      <p className="mt-2 text-sm text-slate-500">
        Nem találja a választ? Írjon nekünk:{" "}
        <a href="mailto:hello@szerzor.com" className="text-brand-600 hover:underline">
          hello@szerzor.com
        </a>
      </p>

      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="card p-5">
            <h2 className="font-semibold text-slate-900">{f.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-500">
        A teljes feltételeket az{" "}
        <Link href="/aszf" className="text-brand-600 underline">
          Általános Szerződési Feltételek
        </Link>
        , az adatkezelést pedig az{" "}
        <Link href="/adatvedelem" className="text-brand-600 underline">
          Adatvédelmi irányelvek
        </Link>{" "}
        tartalmazzák.
      </p>
    </div>
  );
}

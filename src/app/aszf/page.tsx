import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Általános Szerződési Feltételek – SzerzŐr",
};

export default function AszfPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-slate-900">Általános Szerződési Feltételek</h1>
      <p className="mt-2 text-sm text-slate-500">Hatályos: 2026. január 1-től</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">1. A szolgáltató és a szolgáltatás</h2>
          <p className="mt-2">
            A <strong>SzerzŐr</strong> (szerzor.com) olyan webes alkalmazás, amely a felhasználó által
            feltöltött szerződésekből határidőket nyer ki, és emlékeztetőket küld. A Szolgáltatás{" "}
            <strong>tájékoztató jellegű segítség</strong>, nem minősül jogi tanácsadásnak.
          </p>
          <p className="mt-2">
            <strong>Szolgáltató:</strong> Milán · E-mail:{" "}
            <a href="mailto:hello@szerzor.com" className="text-brand-600 hover:underline">
              hello@szerzor.com
            </a>
          </p>
          <p className="mt-2 text-slate-500">
            A szolgáltató teljes cégadatai az <strong>Impresszumban</strong> találhatók. Kérdésekre
            jellemzően <strong>2 munkanapon belül</strong> válaszolunk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">2. Regisztráció és fiók</h2>
          <p className="mt-2">
            A Szolgáltatás használatához regisztráció szükséges. A felhasználó köteles valós adatokat
            megadni, és fiókja adatait (különösen az e-mail-címét) naprakészen tartani. A belépési
            adatok bizalmas kezelése a felhasználó felelőssége.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">3. Csomagok (Ingyenes, Pro, Business)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Ingyenes:</strong> 1 szerződés teljes elemzése (kikötések, határidők, pénzügyi hatás).</li>
            <li><strong>Pro:</strong> 2–14 szerződés, határidő-kinyerés és e-mail emlékeztetők, kép- és PDF-feltöltés.</li>
            <li><strong>Business:</strong> 15+ szerződés, korlátlan használat, minden Pro funkció.</li>
          </ul>
          <p className="mt-2">A Pro és a Business csomag havi, automatikusan megújuló előfizetés.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">4. Ár és fizetés</h2>
          <p className="mt-2">
            A <strong>Pro csomag havi díja €6.90</strong>, a <strong>Business csomag havi díja
            €16.90</strong> (bruttó, áfát tartalmazó ár). A díj a Gumroad fizetési rendszerén
            keresztül, havonta automatikusan kerül felszámításra.
          </p>
          <p className="mt-2">
            <strong>Telefonos értesítés (opcionális):</strong> hívjuk Önt a határidő előtt{" "}
            <strong>14, 7 és 2 nappal</strong>. Díja: Pro csomagban <strong>+€2.90/hó</strong>,
            Business csomagban <strong>+€13.90/hó</strong> (15 szerződésre); további szerződések
            hívásos értesítéséhez <strong>+€2.90 / 3 szerződés</strong>.
          </p>
          <p className="mt-2">
            A Gumroad a vásárlásról bizonylatot állít ki; a tranzakcióra a Gumroad saját feltételei
            vonatkoznak.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">5. Lemondás</h2>
          <p className="mt-2">
            Az előfizetés bármikor lemondható az irányítópulton található „Előfizetés lemondása”
            gombbal (a Gumroadon keresztül). A lemondás a folyó fizetési időszak végén lép
            hatályba: a már kifizetett időszakra a hozzáférés megmarad, újabb terhelés nem történik.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">6. Elállási jog (14 nap)</h2>
          <p className="mt-2">
            A fogyasztónak minősülő felhasználót a szerződéskötéstől számított{" "}
            <strong>14 napon belül</strong> indokolás nélküli elállási jog illeti meg. A Szolgáltatás
            előfizetéses szolgáltatás, ezért az elállási jog a teljesítés megkezdése után is
            megilleti Önt; ebben az esetben az elállásig igénybe vett szolgáltatással{" "}
            <strong>arányos díjat</strong> számíthatunk fel.
          </p>
          <p className="mt-2">
            Az elállási szándékát egyértelmű nyilatkozattal (pl. az alábbi mintanyilatkozat
            megküldésével) jelezheti a{" "}
            <a href="mailto:hello@szerzor.com" className="text-brand-600 hover:underline">
              hello@szerzor.com
            </a>{" "}
            e-mail címen. Az elállási nyilatkozat beérkezésétől számított <strong>14 napon belül</strong>{" "}
            visszatérítjük a befizetett díjat — a fentiek szerinti arányos összeg levonásával.
          </p>
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-800">Elállási mintanyilatkozat</p>
            <p className="mt-1">
              „Alulírott … kijelentem, hogy gyakorolni kívánom elállási jogomat a SzerzŐr Pro
              előfizetésre vonatkozó szerződésem tekintetében. A szerződéskötés időpontja: … .
              Név: … . E-mail-cím: … . Dátum: … .”
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">7. A felhasználó kötelezettségei</h2>
          <p className="mt-2">A felhasználó vállalja, hogy:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>kizárólag olyan dokumentumokat tölt fel, amelyek kezelésére jogosult,</li>
            <li>nem használja a Szolgáltatást jogellenes célra,</li>
            <li>nem kísérli meg a Szolgáltatás biztonsági rendszereinek megkerülését.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">8. A Szolgáltatás jellege</h2>
          <p className="mt-2">
            A SzerzŐr <strong>tájékoztatást</strong> nyújt: megjelöli a szerződésben az átgondolandó
            pontokat, a határidőket és a lehetséges pénzügyi hatásokat. Ez <strong>nem minősül jogi
            tanácsadásnak</strong>, és nem helyettesíti ügyvéd tanácsát. A szerződéseivel kapcsolatos
            döntéseket a felhasználó saját felelősségére hozza meg.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">9. Felelősség</h2>
          <p className="mt-2">
            A Szolgáltatás a lehető legnagyobb gondossággal működik; a megbízhatóság érdekében
            minden határidőről <strong>több emlékeztetőt</strong> küldünk (90, 60, 30, 14, 7, 4, 2, 1
            nappal előtte).
          </p>
          <p className="mt-2">
            A Szolgáltató felelőssége — a jogszabály által ki nem zárható esetek (szándékos károkozás,
            testi épség sérelme) kivételével — <strong>az elmúlt 12 hónapban befizetett díjak
            összegére</strong> korlátozódik.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">10. Szellemi tulajdon</h2>
          <p className="mt-2">
            A Szolgáltatás szoftvere, arculata és tartalma a Szolgáltató szellemi tulajdona. A
            felhasználó által feltöltött dokumentumok a felhasználó tulajdonában maradnak.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">11. Felfüggesztés és megszüntetés</h2>
          <p className="mt-2">
            A Szolgáltató jogosult a fiók felfüggesztésére vagy megszüntetésére, ha a felhasználó a
            jelen feltételeket súlyosan vagy ismételten megszegi. A felhasználó a fiókját bármikor
            törölheti.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">12. A feltételek módosítása</h2>
          <p className="mt-2">
            A Szolgáltató a jelen feltételeket alapos okból módosíthatja. A módosításról a
            felhasználókat <strong>legalább 15 nappal előre, e-mailben</strong> értesítjük. Ha a
            felhasználó a módosítást nem fogadja el, az előfizetését{" "}
            <strong>díjmentesen felmondhatja</strong> a hatálybalépés előtt.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">13. Panaszkezelés</h2>
          <p className="mt-2">
            Panaszát a{" "}
            <a href="mailto:hello@szerzor.com" className="text-brand-600 hover:underline">
              hello@szerzor.com
            </a>{" "}
            címen jelezheti; <strong>30 napon belül</strong> érdemben válaszolunk.
          </p>
          <p className="mt-2">
            Fogyasztói jogvita esetén a felhasználó a lakóhelye szerint illetékes{" "}
            <strong>békéltető testülethez</strong> vagy a{" "}
            <strong>fogyasztóvédelmi hatósághoz</strong> (kormányhivatal fogyasztóvédelmi osztálya)
            fordulhat.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">14. Irányadó jog és vitarendezés</h2>
          <p className="mt-2">
            A jelen feltételekre a magyar jog az irányadó. A felek a vitákat elsősorban békés úton
            rendezik. Jogvita esetén a magyar bíróságok járnak el.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">15. Kapcsolat</h2>
          <p className="mt-2">
            Kérdéseivel forduljon hozzánk:{" "}
            <a href="mailto:hello@szerzor.com" className="text-brand-600 hover:underline">
              hello@szerzor.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

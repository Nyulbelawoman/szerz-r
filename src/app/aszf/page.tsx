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
            A <strong>SzerzŐr</strong> (a továbbiakban: „Szolgáltatás”) olyan webes alkalmazás, amely a
            felhasználó által feltöltött szerződésekből határidőket nyer ki, és emlékeztetőket küld.
            A Szolgáltatás tájékoztató jellegű segítség.
          </p>
          <p className="mt-2">
            <strong>Szolgáltató:</strong> [Név / egyéni vállalkozó] · E-mail:{" "}
            <a href="mailto:hello@szerzor.hu" className="text-brand-600 hover:underline">
              hello@szerzor.hu
            </a>
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
          <h2 className="text-base font-semibold text-slate-900">3. Csomagok (Ingyenes és Pro)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Ingyenes:</strong> 1 szerződés elemzése, emlékeztetők nélkül.</li>
            <li><strong>Pro:</strong> korlátlan szerződés, határidő-kinyerés és e-mail emlékeztetők, PDF-feltöltés.</li>
          </ul>
          <p className="mt-2">A Pro csomag a jelen feltételek szerint előfizetéses szolgáltatás.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">4. Díjak és fizetés</h2>
          <p className="mt-2">
            A Pro csomag díja a weboldalon feltüntetett összeg. A fizetés a Gumroad fizetési
            rendszerén keresztül történik. A fizetés lebonyolítására a Gumroad saját feltételei
            vonatkoznak.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">5. Lemondás</h2>
          <p className="mt-2">
            Az előfizetés a Gumroad felületén bármikor lemondható. A lemondás a folyó fizetési
            időszak végéig biztosítja a hozzáférést; visszamenőleges jóváírást nem tudunk adni.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">6. A felhasználó kötelezettségei</h2>
          <p className="mt-2">A felhasználó vállalja, hogy:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>kizárólag olyan dokumentumokat tölt fel, amelyek kezelésére jogosult,</li>
            <li>nem használja a Szolgáltatást jogellenes célra,</li>
            <li>nem kísérli meg a Szolgáltatás biztonsági rendszereinek megkerülését.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">7. Felelősség és jogi nyilatkozat</h2>
          <p className="mt-2">
            A Szolgáltatás által megjelenített elemzések és emlékeztetők{" "}
            <strong>automatikus elemzésen alapuló tájékoztatások</strong>, és{" "}
            <strong>nem minősülnek jogi tanácsadásnak</strong>. A Szolgáltatás nem helyettesíti
            szakképzett ügyvéd tanácsát. A felhasználó a szerződéseivel kapcsolatos döntéseket saját
            felelősségére hozza meg.
          </p>
          <p className="mt-2">
            A Szolgáltató a lehető legnagyobb gondossággal jár el, de a jogszabály által megengedett
            legteljesebb mértékben nem vállal felelősséget az elemzés pontosságáért, az adatvesztésért
            vagy az emlékeztetők elmaradásából eredő károkért.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">8. Szellemi tulajdon</h2>
          <p className="mt-2">
            A Szolgáltatás szoftvere, arculata és tartalma a Szolgáltató szellemi tulajdona. A
            felhasználó által feltöltött dokumentumok a felhasználó tulajdonában maradnak.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">9. Felfüggesztés és megszüntetés</h2>
          <p className="mt-2">
            A Szolgáltató jogosult a fiók felfüggesztésére vagy megszüntetésére, ha a felhasználó a
            jelen feltételeket súlyosan vagy ismételten megszegi. A felhasználó a fiókját bármikor
            törölheti.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">10. A feltételek módosítása</h2>
          <p className="mt-2">
            A Szolgáltató jogosult a jelen feltételeket egyoldalúan módosítani. A módosításokról a
            Szolgáltató a weboldalon, illetve e-mailben értesíti a felhasználókat.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">11. Irányadó jog és vitarendezés</h2>
          <p className="mt-2">
            A jelen feltételekre a magyar jog az irányadó. A felek a vitákat elsősorban békés úton
            rendezik. Jogvita esetén a magyar bíróságok járnak el.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">12. Kapcsolat</h2>
          <p className="mt-2">
            Kérdéseivel forduljon hozzánk:{" "}
            <a href="mailto:hello@szerzor.hu" className="text-brand-600 hover:underline">
              hello@szerzor.hu
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

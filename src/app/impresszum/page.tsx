import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impresszum – SzerzŐr",
};

export default function ImpresszumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-slate-900">Impresszum</h1>
      <p className="mt-2 text-sm text-slate-500">A 2001. évi CVIII. törvény (Eker. tv.) 4. § alapján</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">Szolgáltató adatai</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Név:</strong> Milán</li>
            <li><strong>Székhely / cím:</strong> Pest vármegye</li>
            <li>
              <strong>E-mail:</strong>{" "}
              <a href="mailto:hello@szerzor.com" className="text-brand-600 hover:underline">
                hello@szerzor.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">A szolgáltatás</h2>
          <p className="mt-2">
            A <strong>SzerzŐr</strong> (szerzor.com) egy webes alkalmazás, amely a felhasználó által
            feltöltött szerződésekből határidőket nyer ki, és emlékeztetőket küld. A szolgáltatás
            tájékoztató jellegű, nem minősül jogi tanácsadásnak.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Tárhelyszolgáltató</h2>
          <p className="mt-2">
            A weboldal tárhelyét a <strong>Render Services, Inc.</strong> (USA) biztosítja.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">Panaszkezelés és vitarendezés</h2>
          <p className="mt-2">
            Kérdéseivel, panaszaival forduljon hozzánk a fenti e-mail címen. Fogyasztói jogvita
            esetén a fogyasztó a lakóhelye szerinti békéltető testülethez vagy a{" "}
            <a
              href="https://naih.hu"
              target="_blank"
              rel="noopener"
              className="text-brand-600 hover:underline"
            >
              Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH)
            </a>{" "}
            fordulhat.
          </p>
        </section>
      </div>
    </div>
  );
}

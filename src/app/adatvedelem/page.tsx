import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adatvédelmi tájékoztató – SzerzŐr",
};

export default function AdatvedelemPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-slate-900">Adatvédelmi tájékoztató</h1>
      <p className="mt-2 text-sm text-slate-500">Utolsó frissítés: 2026. január</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-semibold text-slate-900">1. Milyen adatokat gyűjtünk</h2>
          <p className="mt-2">
            A regisztrációhoz e-mail-címet és jelszót kérünk. A szolgáltatás használatához a
            szerződések szövegét dolgozzuk fel.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">2. Hogyan használjuk az adatokat</h2>
          <p className="mt-2">
            Az adatokat kizárólag a szolgáltatás működtetéséhez használjuk: a szerződésekben szereplő
            határidők kinyerésére és emlékeztetők küldésére.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">3. Titkosítás és védelem</h2>
          <p className="mt-2">
            A szerződéseket szállítás közben (TLS) és tároláskor is titkosítva kezeljük. Nem adunk el
            és nem osztunk meg adatokat harmadik féllel.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">4. Törlés</h2>
          <p className="mt-2">
            Bármikor törölheti a szerződéseit és a fiókját. A törlés a hozzá kapcsolódó összes adatra
            kiterjed.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">5. Kapcsolat</h2>
          <p className="mt-2">
            Adatvédelmi kérdésekkel írjon a következő címre: adatvedelem@szerzor.hu
          </p>
        </section>
      </div>
    </div>
  );
}

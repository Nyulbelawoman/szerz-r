import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Általános Szerződési Feltételek – SzerzŐr",
};

export default function AszfPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-slate-900">Általános Szerződési Feltételek</h1>
      <p className="mt-2 text-sm text-slate-500">Utolsó frissítés: 2026. január</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="font-semibold text-slate-900">1. A szolgáltatás</h2>
          <p className="mt-2">
            A SzerzŐr a szerződéseiben szereplő határidőket gyűjti ki, és emlékeztetőket küld. A
            szolgáltatás tájékoztató jellegű segítség.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">2. Előfizetés</h2>
          <p className="mt-2">
            Az ingyenes csomag 1 szerződés elemzését teszi lehetővé. A Pro csomag korlátlan
            szerződést és határidő-emlékeztetőket biztosít. Az előfizetés bármikor lemondható.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">3. Felelősség</h2>
          <p className="mt-2">
            A SzerzŐr tájékoztató jellegű segítséget nyújt. A megjelenített elemzések nem minősülnek
            jogi tanácsadásnak.
          </p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-900">4. Jogi nyilatkozat</h2>
          <p className="mt-2">
            A SzerzŐr segédlet, nem jogi tanácsadás. Fontos döntések előtt mindig konzultáljon
            szakképzett ügyvéddel.
          </p>
        </section>
      </div>
    </div>
  );
}

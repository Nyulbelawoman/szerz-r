import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adatvédelmi irányelvek – SzerzŐr",
};

export default function AdatvedelemPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-slate-900">Adatvédelmi irányelvek</h1>
      <p className="mt-2 text-sm text-slate-500">Hatályos: 2026. január 1-től</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">1. Bevezetés és az adatkezelő</h2>
          <p className="mt-2">
            A jelen tájékoztató a <strong>SzerzŐr</strong> webes szolgáltatás (a továbbiakban:
            „Szolgáltatás”) adatkezelését írja le. Az adatkezelő a Szolgáltatás üzemeltetője.
          </p>
          <p className="mt-2">
            <strong>Adatkezelő:</strong> Milán · E-mail:{" "}
            <a href="mailto:adatvedelem@szerzor.com" className="text-brand-600 hover:underline">
              adatvedelem@szerzor.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">2. Milyen adatokat kezelünk</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Fiók adatai:</strong> e-mail-cím, jelszó (titkosított hash formában), csomag típusa, regisztráció időpontja.</li>
            <li><strong>Feltöltött tartalom:</strong> az Ön által feltöltött vagy beillesztett szerződések szövege, valamint az ezekből kinyert határidők és elemzési adatok.</li>
            <li><strong>Használati adatok:</strong> technikai naplók (IP-cím, böngésző típusa, hozzáférési időpontok) a biztonság és a hibaelhárítás érdekében.</li>
          </ul>
          <p className="mt-2">
            A feltöltött szerződések harmadik személyek (pl. bérbeadó, szerződő partner) adatait is
            tartalmazhatják. Az ilyen dokumentumok feltöltésével Ön szavatolja, hogy arra jogosult;
            ezeket az adatokat is a jelen tájékoztató szerint, a Szolgáltatás nyújtásához szükséges
            mértékben kezeljük.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">3. Az adatkezelés célja és jogalapja</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>A Szolgáltatás nyújtása és a szerződés teljesítése — GDPR 6. cikk (1) bek. b) pont.</li>
            <li>Biztonsági és csalásmegelőzési célok — GDPR 6. cikk (1) bek. f) pont (jogos érdek).</li>
            <li>Marketing (hírlevél, ajánlatok) — kizárólag az Ön <strong>külön hozzájárulásával</strong> (GDPR 6. cikk (1) bek. a) pont).</li>
          </ul>
          <p className="mt-2">
            <strong>Átláthatóság:</strong> a szerződések elemzését <strong>mesterséges intelligencia
            (AI)</strong> végzi. A szerződés szövegét kizárólag az elemzés céljából továbbítjuk az
            AI-szolgáltatónak, aki <strong>nem használja fel betanításra</strong> és nem tárolja
            tartósan. Az adatokat EU-n belül tároljuk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">4. Adatfeldolgozók (harmadik felek)</h2>
          <p className="mt-2">A Szolgáltatás működéséhez az alábbi adatfeldolgozókat vesszük igénybe:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Supabase</strong> — adatbázis-tárolás (PostgreSQL).</li>
            <li><strong>Anthropic</strong> — a szerződések elemzése; az adatokat nem használja betanításra.</li>
            <li><strong>Render</strong> — tárhely (hoszting).</li>
            <li><strong>Resend</strong> — tranzakciós e-mailek (emlékeztetők) küldése.</li>
            <li><strong>Gumroad</strong> — fizetés kezelése.</li>
            <li><strong>Google Analytics</strong> — anonim látogatási statisztika (kizárólag az Ön süti-hozzájárulása esetén).</li>
            <li><strong>Meta (Facebook) Pixel</strong> — hirdetés-mérés és konverziókövetés (kizárólag az Ön süti-hozzájárulása esetén).</li>
          </ul>
          <p className="mt-2">Az adatfeldolgozók szerződésben vállalják a GDPR szerinti adatkezelést.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">5. Adatbiztonság</h2>
          <p className="mt-2">
            A szerződéseket szállítás közben (TLS-titkosítás) és tároláskor is titkosítva kezeljük.
            A jelszavakat kriptográfiai hash formában tároljuk. A szerződéseket nem adjuk el, és nem
            osztjuk meg harmadik féllel.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">6. Tárolási időtartam</h2>
          <p className="mt-2">
            Az adatokat a fiók fennállásáig tároljuk. A szerződéseket és a fiókot Ön bármikor
            törölheti; ezt követően az adatokat töröljük. A számlázással kapcsolatos adatokat a
            jogszabályi kötelezettségek (pl. számviteli előírások) szerinti ideig őrizzük meg.
          </p>
          <p className="mt-2">
            A technikai naplókat (IP-cím, böngésző) legfeljebb <strong>30 napig</strong> őrizzük,
            kivéve, ha biztonsági incidens kivizsgálása hosszabb megőrzést indokol.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">7. Az Ön jogai (GDPR)</h2>
          <p className="mt-2">Ön jogosult:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>hozzáférést kérni az adataihoz (GDPR 15. cikk),</li>
            <li>az adatok helyesbítését kérni (16. cikk),</li>
            <li>az adatok törlését kérni („elfeledtetéshez való jog”, 17. cikk),</li>
            <li>az adatkezelés korlátozását kérni (18. cikk),</li>
            <li>az adatok hordozhatóságát kérni (20. cikk),</li>
            <li>tiltakozni az adatkezelés ellen (21. cikk),</li>
            <li>a megadott hozzájárulást bármikor visszavonni (7. cikk).</li>
          </ul>
          <p className="mt-2">
            Kérelmét az{" "}
            <a href="mailto:adatvedelem@szerzor.com" className="text-brand-600 hover:underline">
              adatvedelem@szerzor.com
            </a>{" "}
            címen jelezheti; a kérelemre 30 napon belül válaszolunk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">8. Nemzetközi adattovábbítás</h2>
          <p className="mt-2">
            Egyes adatfeldolgozók az EU-n kívül (pl. USA) is működhetnek. Az adattovábbítás az Európai
            Bizottság által elfogadott megfelelőségi mechanizmusok alapján történik: az EU–US Data
            Privacy Framework keretében, illetve ahol ez nem alkalmazható, az Európai Bizottság által
            elfogadott általános szerződési feltételek (SCC) alapján.
          </p>
          <p className="mt-2">
            A szerződések tárolását szolgáló <strong>Supabase-adatbázis EU-régióban</strong> üzemel.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">9. Sütik (cookie-k)</h2>
          <p className="mt-2">
            A Szolgáltatás a bejelentkezés fenntartásához elengedhetetlen, <strong>funkcionális
            sütiket</strong> használ — ezekhez hozzájárulás nem szükséges.
          </p>
          <p className="mt-2">
            Ezen felül, <strong>kizárólag az Ön külön hozzájárulásával</strong>, anonim látogatási
            statisztika céljából <strong>Google Analytics</strong>, illetve hirdetés-mérés céljából{" "}
            <strong>Meta (Facebook) Pixel</strong> sütiket alkalmazunk. Ha nem járul hozzá, ezek a
            sütik nem kerülnek elhelyezésre, és a Szolgáltatás használata ettől függetlenül teljes
            körűen működik. A hozzájárulást a weboldalon megjelenő süti-sávon bármikor kezelheti.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">10. Panasz és jogorvoslat</h2>
          <p className="mt-2">
            Ha úgy érzi, hogy az adatkezelés jogsértő, panasszal fordulhat a Nemzeti Adatvédelmi és
            Információszabadság Hatósághoz (NAIH; naih.hu), vagy bírósághoz fordulhat.
          </p>
        </section>
      </div>
    </div>
  );
}

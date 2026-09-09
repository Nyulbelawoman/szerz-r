"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SAMPLE = `BÉRLETI SZERZŐDÉS

Ez a bérleti szerződés 2025. január 10. napján jött létre a Bérbeadó és a Bérlő között a 123. Fő utca alatti ingatlanra vonatkozóan.

Időtartam: A bérleti időszak 2025. március 1-jén kezdődik és 2026. február 28-án ér véget.

Bérleti díj: A Bérlő havi 185 000 Ft bérleti díjat fizet, minden hónap 1. napjáig. Az 5. nap után beérkező fizetések után 7 500 Ft késedelmi díj kerül felszámításra.

Kaució: A Bérlő 185 000 Ft kauciót fizet, amelyet a kiköltözés után 30 napon belül vissza kell fizetni, a tételes levonásokkal csökkentve.

Automatikus hosszabbítás: Ez a szerződés automatikusan meghosszabbodik további egyéves időtartamokra, kivéve ha bármelyik fél a futamidő lejárta előtt legalább 60 nappal írásban jelzi a meg nem hosszabbítási szándékát.

Bérletidíj-emelés: A Bérbeadó a megújításkor legfeljebb 8%-kal emelheti a bérleti díjat, 30 napos írásbeli értesítés mellett.

Felmondás: A Bérlő korai felmondása a két havi bérleti díjnak megfelelő díj megfizetését igényli.

Felelősség: A Bérlő vállalja, hogy mentesíti a Bérbeadót minden olyan igény alól, amely a Bérlő ingatlanhasználatából ered.

Vitarendezés: A szerződésből eredő bármely vitát kötelező választottbírósági eljárásban kell rendezni. A Bérlő a szerződés aláírásától számított 30 napon belül írásban lemondhat erről a választottbírósági rendelkezésről.

Közüzemi díjak: A Bérlő felelős az áram, gáz és internet díjáért.`;

export default function UploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"pre_sign" | "post_sign">("post_sign");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setText("");
    setError("");
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (file) {
      setLoading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("title", title.trim() || "Megnevezés nélküli szerződés");
        fd.append("mode", mode);
        const res = await fetch("/api/contracts/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error || "A fájl elemzése nem sikerült. Próbálja inkább beilleszteni a szöveget.");
          setLoading(false);
          return;
        }
        router.push(`/contract/${data.id}`);
      } catch {
        setError("Hálózati hiba – próbálja újra.");
        setLoading(false);
      }
      return;
    }

    if (text.trim().length < 40) {
      setError("Illessze be legalább néhány mondatot a szerződésből, vagy válasszon fájlt.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Megnevezés nélküli szerződés",
          text: text.trim(),
          mode,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Az elemzés nem sikerült. Próbálja újra.");
        setLoading(false);
        return;
      }
      router.push(`/contract/${data.id}`);
    } catch {
      setError("Hálózati hiba – próbálja újra.");
      setLoading(false);
    }
  }

  const modeBtn = (active: boolean) =>
    `flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition ${
      active
        ? "border-brand-600 bg-brand-50"
        : "border-slate-200 bg-white hover:border-slate-300"
    }`;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Mode selector */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Hol tart most a folyamatban?
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("pre_sign")}
            className={modeBtn(mode === "pre_sign")}
          >
            <span className="text-lg">✍️</span>
            <span className="text-sm font-semibold text-slate-900">Aláírás előtt állok</span>
            <span className="text-xs text-slate-500">
              Aláírási ajánlás + mit tárgyaljon meg először.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode("post_sign")}
            className={modeBtn(mode === "post_sign")}
          >
            <span className="text-lg">🗂️</span>
            <span className="text-sm font-semibold text-slate-900">Már aláírtam</span>
            <span className="text-xs text-slate-500">
              Mihez kötötte magát + határidő-követés.
            </span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="title">
          Szerződés neve <span className="font-normal text-slate-400">(opcionális)</span>
        </label>
        <input
          id="title"
          className="input"
          placeholder="pl. Albérleti szerződés – 123. Fő utca"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Text */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700" htmlFor="text">
            Szerződés szövege
          </label>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE);
              setFile(null);
              setTitle("Minta bérleti szerződés");
              setError("");
            }}
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            Minta bérleti szerződés használata
          </button>
        </div>
        <textarea
          id="text"
          className="input min-h-[240px] font-mono text-xs leading-relaxed"
          placeholder="Illessze be ide a szerződés teljes szövegét…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value) setFile(null);
          }}
        />
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>vagy töltsön fel PDF / .txt fájlt</span>
          <input
            type="file"
            accept=".pdf,.txt,.md,.text"
            onChange={handleFile}
            className="text-xs file:mr-2 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
          />
          {file && <span className="font-medium text-slate-600">Betöltve: {file.name}</span>}
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>
        {loading
          ? "Szerződés olvasása…"
          : mode === "pre_sign"
          ? "Ellenőrzés aláírás előtt"
          : "Szerződés elemzése"}
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
          {file ? "Szöveg kinyerése és elemzés" : "Kikötések és határidők elemzése"} – ez néhány
          másodpercet vehet igénybe…
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        A SzerzŐr segédlet, nem jogi tanácsadás. A szerződés elemzése segít a kockázatok
        felismerésében – cselekvés előtt mindig ellenőrizze.
      </p>
    </form>
  );
}

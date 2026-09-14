"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-PRHMS79LL3";
const CONSENT_KEY = "sz_cookie_consent";

export default function CookieConsent() {
  // null = még nincs döntés (banner látható); accepted/declined = eltárolva
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {
      stored = null;
    }
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
    }
    setReady(true);
  }, []);

  function choose(value: "accepted" | "declined") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="sz-gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}

      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              🍪 A SzerzŐr a bejelentkezéshez szükséges (funkcionális) sütiket használ, valamint — az Ön
              hozzájárulásával — anonim látogatási statisztikát (Google Analytics). Bővebben:{" "}
              <a href="/adatvedelem" className="text-brand-600 underline">
                Adatvédelmi irányelvek
              </a>
            </p>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => choose("declined")} className="btn-ghost px-3 py-1.5 text-sm">
                Csak a szükségeseket
              </button>
              <button onClick={() => choose("accepted")} className="btn-primary px-3 py-1.5 text-sm">
                Elfogadom
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

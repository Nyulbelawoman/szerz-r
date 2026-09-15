"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { trackPixel } from "@/lib/pixel";

const GA_ID = "G-PRHMS79LL3";
const PIXEL_ID = "1734974754459673";
const CONSENT_KEY = "sz_cookie_consent";

const META_PIXEL_SNIPPET = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`;

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

  // Fizetési szándék követése: ha bármelyik Gumroad linkre kattintanak.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = e.target as HTMLElement;
      const a = el.closest?.("a") as HTMLAnchorElement | null;
      if (a && a.href && a.href.includes("gumroad")) {
        trackPixel("InitiateCheckout");
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
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
          <Script id="sz-fbq" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: META_PIXEL_SNIPPET }} />
        </>
      )}

      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              🍪 A SzerzŐr a bejelentkezéshez szükséges (funkcionális) sütiket használ, valamint — az Ön
              hozzájárulásával — anonim látogatási statisztikát (Google Analytics) és hirdetés-követést
              (Meta Pixel). Bővebben:{" "}
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

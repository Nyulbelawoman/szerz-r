"use client";

import { useEffect, useState } from "react";

const GA_ID = "G-PRHMS79LL3";
const CONSENT_KEY = "sz_cookie_consent";

function loadAnalytics() {
  if (document.getElementById("sz-gtag")) return;
  const s = document.createElement("script");
  s.id = "sz-gtag";
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);

  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    (w.dataLayer as unknown[]).push(args);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { page_path: window.location.pathname });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted") {
      loadAnalytics();
    } else if (!stored) {
      setVisible(true);
    }
    // "declined" esetén nem töltünk be analitikát.
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    loadAnalytics();
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
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
          <button onClick={decline} className="btn-ghost px-3 py-1.5 text-sm">
            Csak a szükségeseket
          </button>
          <button onClick={accept} className="btn-primary px-3 py-1.5 text-sm">
            Elfogadom
          </button>
        </div>
      </div>
    </div>
  );
}

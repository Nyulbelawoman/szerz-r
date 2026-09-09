"use client";

import { useState } from "react";

export default function LetterGenerator({
  contractId,
  mode,
}: {
  contractId: string;
  mode: string;
}) {
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPreSign = mode === "pre_sign";

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/letter`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setLetter(data.letter || "A levél generálása nem sikerült. Próbálja újra.");
    } catch {
      setLetter("A levél generálása nem sikerült. Próbálja újra.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="card mt-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">
            {isPreSign ? "✍️ Tárgyalási levél" : "📨 Intézkedési levél"}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {isPreSign
              ? "Küldésre kész – arra kéri a másik felet, hogy aláírás előtt módosítsa a megjelölt feltételeket."
              : "Küldésre kész – a jogai érvényesítésére (lemondás, felmondás, kaució visszaigénylése)."}
          </p>
        </div>
        {!letter && (
          <button onClick={generate} disabled={loading} className="btn-primary shrink-0">
            {loading ? "Írás…" : "Levél generálása"}
          </button>
        )}
      </div>

      {letter && (
        <>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {letter}
          </pre>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={copy} className="btn-primary">
              {copied ? "Másolva!" : "Másolás"}
            </button>
            <button onClick={generate} disabled={loading} className="btn-ghost">
              Újragenerálás
            </button>
          </div>
        </>
      )}
    </div>
  );
}

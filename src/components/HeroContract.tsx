"use client";

import { useRef, useState } from "react";

export default function HeroContract() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  }

  return (
    <div
      className="relative mx-auto w-full max-w-md"
      style={{ perspective: 1400 }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="absolute -inset-10 -z-10 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="animate-float">
        <div
          className="rounded-2xl bg-[#fdfbf6] p-6 shadow-2xl ring-1 ring-black/5"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.2s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <p className="font-serif text-sm font-semibold tracking-wide text-stone-800">
                BÉRLETI SZERZŐDÉS
              </p>
              <p className="text-[10px] text-stone-400">123. Fő utca · Budapest</p>
            </div>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
              3 csapda
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-[11px] leading-relaxed text-stone-600">
            <p>
              <span className="font-semibold text-stone-800">1. Időtartam:</span> 2025.03.01 –
              2026.02.28.
            </p>
            <p>
              <span className="font-semibold text-stone-800">2. Bérleti díj:</span> 185 000 Ft/hó,
              minden hónap 1. napjáig.
            </p>
            <div className="rounded-lg bg-red-50 p-2 ring-1 ring-red-200">
              <p className="text-stone-700">
                <span className="font-semibold text-red-700">⚠️ 3. Automatikus hosszabbítás:</span>{" "}
                a szerződés automatikusan meghosszabbodik, ha a futamidő vége előtt 60 nappal nem
                mondja fel.
              </p>
            </div>
            <p>
              <span className="font-semibold text-stone-800">4. Kaució:</span> 185 000 Ft,
              kiköltözés után 30 napon belül.
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-ink-900 px-3 py-2 text-[11px] font-medium text-gold-300">
            ⏰ Március 3-ig mondja fel a megújulás elkerüléséhez
          </div>
        </div>
      </div>
    </div>
  );
}

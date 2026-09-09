"use client";

import { useState } from "react";

export default function HeroContract() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[360px]"
      style={{ perspective: 1600 }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="absolute -inset-12 -z-10 rounded-full bg-gold-400/15 blur-3xl" />
      <div className="animate-float-rotate">
        <div
          className="rounded-[3px] bg-[#fffdf8] p-6 shadow-[0_50px_90px_-25px_rgba(0,0,0,0.65)] ring-1 ring-black/10"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.2s ease-out",
            aspectRatio: "210 / 297",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Fejléc */}
          <div className="text-center">
            <p className="font-serif text-[13px] font-bold tracking-wide text-stone-800">
              BÉRLETI SZERZŐDÉS
            </p>
            <p className="mt-0.5 text-[9px] text-stone-400">
              amely létrejött egyrészről a Bérbeadó, másrészről a Bérlő között
            </p>
          </div>
          <div className="my-2 h-px w-full bg-stone-200" />

          {/* Kikötések */}
          <div className="space-y-1.5 text-[9.5px] leading-relaxed text-stone-600">
            <p>
              <span className="font-semibold text-stone-800">1. Ingatlan:</span> Budapest, 123. Fő utca.
            </p>
            <p>
              <span className="font-semibold text-stone-800">2. Időtartam:</span> 2025.03.01 – 2026.02.28.
            </p>
            <p>
              <span className="font-semibold text-stone-800">3. Bérleti díj:</span> 185 000 Ft/hó, minden
              hónap 1. napjáig.
            </p>
            <p>
              <span className="font-semibold text-stone-800">4. Kaució:</span> 185 000 Ft, kiköltözés után 30
              napon belül.
            </p>
            <div className="rounded bg-red-50 p-1.5 ring-1 ring-red-200">
              <p className="text-stone-700">
                <span className="font-semibold text-red-700">5. Automatikus hosszabbítás:</span> a szerződés
                automatikusan meghosszabbodik, ha a futamidő vége előtt 60 nappal nem mondják fel írásban.
              </p>
            </div>
            <p>
              <span className="font-semibold text-stone-800">6. Felmondás:</span> a Bérlő korai felmondása két
              havi díj megfizetését igényli.
            </p>
            <p>
              <span className="font-semibold text-stone-800">7. Vitarendezés:</span> a vitákat választottbíróság
              dönti el.
            </p>
            <p>
              <span className="font-semibold text-stone-800">8. Közüzemi díjak:</span> a Bérlőt terhelik.
            </p>
          </div>

          {/* Aláírások */}
          <div className="mt-auto pt-3">
            <div className="my-2 h-px w-full bg-stone-200" />
            <div className="flex justify-between text-[9px] text-stone-500">
              <div>
                <p className="border-t border-stone-300 pt-1">Bérbeadó</p>
              </div>
              <div>
                <p className="border-t border-stone-300 pt-1">Bérlő</p>
              </div>
            </div>
            <div className="mt-3 rounded bg-ink-900 px-2.5 py-1.5 text-center text-[10px] font-medium text-gold-300">
              ⏰ Március 3-ig mondja fel a megújulás elkerüléséhez
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

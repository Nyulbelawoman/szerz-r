import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "SzerzŐr – Ne hagyja, hogy az apró betűk csapdába ejtsék",
  description:
    "Tegye be a szerződéseit, és a SzerzŐr kinyeri a határidőket, és időben emlékezteti.",
};

function Logo() {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center">
      <svg viewBox="0 0 32 32" className="h-9 w-9 drop-shadow-sm">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#8a6d1f" />
          </linearGradient>
        </defs>
        <path
          d="M16 1.5 L28 6.5 V15 C28 23 22.5 28.5 16 30.5 C9.5 28.5 4 23 4 15 V6.5 Z"
          fill="url(#logoGrad)"
        />
        <path
          d="M10 15.5 L14 19.5 L22 11.5"
          stroke="#0B1120"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html lang="hu">
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo />
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900">
                Szerz<span className="text-gold-500">Őr</span>
              </span>
            </Link>

            <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
              <Link href="/#features" className="transition hover:text-slate-900">
                Funkciók
              </Link>
              <Link href="/#modes" className="transition hover:text-slate-900">
                Hogyan működik
              </Link>
              <Link href="/#pricing" className="transition hover:text-slate-900">
                Árak
              </Link>
            </div>

            <div className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <Link href="/dashboard" className="font-medium text-slate-600 hover:text-slate-900">
                    Irányítópult
                  </Link>
                  <Link href="/upload" className="btn-primary">
                    Új szerződés
                  </Link>
                  <form action="/api/auth/signout" method="post">
                    <button
                      type="submit"
                      className="font-medium text-slate-500 transition hover:text-slate-800"
                    >
                      Kijelentkezés
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/signin" className="font-medium text-slate-600 hover:text-slate-900">
                    Bejelentkezés
                  </Link>
                  <Link href="/signup" className="btn-primary">
                    Kezdés
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2.5">
                <Logo />
                <span className="font-serif text-lg font-bold text-slate-900">
                  Szerz<span className="text-gold-500">Őr</span>
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-slate-500">
                A szerződéseid és a határidőid egy helyen — időben szólunk, mielőtt lecsúsznál.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Termék</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li><Link href="/#features" className="hover:text-slate-800">Funkciók</Link></li>
                <li><Link href="/#pricing" className="hover:text-slate-800">Árak</Link></li>
                <li><Link href="/signup" className="hover:text-slate-800">Kezdés</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Jogi</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li><Link href="/aszf" className="hover:text-slate-800">Általános Szerződési Feltételek</Link></li>
                <li><Link href="/adatvedelem" className="hover:text-slate-800">Adatvédelmi irányelvek</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-slate-500">
              <p>
                <strong className="text-slate-600">A SzerzŐr segédlet, nem jogi tanácsadás.</strong>{" "}
                A megjelölt pontokat mindig ellenőrizze, és fontos döntések előtt kérjen ügyvédi
                segítséget.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

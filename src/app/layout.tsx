import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "SzerzŐr – Ne hagyja, hogy az apró betűk csapdába ejtsék",
  description:
    "Töltse fel a szerződését, és a SzerzŐr feltárja a csapdákat, és emlékezteti minden határidő előtt.",
};

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
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-sm font-bold text-white shadow-sm">
                SZ
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Szerz<span className="text-brand-600">Őr</span>
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
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 text-xs font-bold text-white">
                  SZ
                </span>
                <span className="font-bold text-slate-900">
                  Szerz<span className="text-brand-600">Őr</span>
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-slate-500">
                AI, amely elolvassa a szerződéseit, feltárja a csapdákat, és emlékezteti minden
                határidő előtt.
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
                <li><span className="cursor-default">Általános Szerződési Feltételek</span></li>
                <li><span className="cursor-default">Adatvédelmi irányelvek</span></li>
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

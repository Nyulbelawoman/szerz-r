import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import UploadForm from "@/components/UploadForm";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signin");

  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Új szerződés elemzése</h1>
      <p className="mt-1 text-sm text-slate-600">
        Illessze be a szerződés szövegét, vagy töltsön fel PDF-et. Feltárjuk a csapdákat, kinyerjük a
        határidőket, és beütemezzük az emlékeztetőket.
      </p>

      {!hasKey && (
        <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Demó mód.</strong> Nincs <code className="font-mono">ANTHROPIC_API_KEY</code>{" "}
          beállítva, ezért az elemzés csak egy korlátozott, angol nyelvű kulcsszavas vizsgálat, amely a
          legtöbb csapdát kihagyja, és nem tud magyar nyelvű szerződést elemezni. Adja meg a kulcsát a{" "}
          <code className="font-mono">.env.local</code> fájlban, és indítsa újra a teljes
          elemzéshez.
        </div>
      )}

      <div className="card mt-6 p-6">
        <UploadForm />
      </div>
    </div>
  );
}

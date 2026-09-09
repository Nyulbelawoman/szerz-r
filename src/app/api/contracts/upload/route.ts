import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createContract, setContractError } from "@/lib/db";
import { runAnalysis } from "@/lib/analyze";
import { extractPdfText, extractTextFile } from "@/lib/parseDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEXT_EXTS = ["txt", "md", "text"];

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Érvénytelen adat." }, { status: 400 });

  const file = form.get("file");
  const titleField = form.get("title");
  if (!file || typeof file === "string" || typeof (file as any).arrayBuffer !== "function") {
    return NextResponse.json({ error: "Nincs megadva fájl." }, { status: 400 });
  }

  const name = typeof (file as any).name === "string" ? (file as any).name : "contract";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const buffer = Buffer.from(await (file as any).arrayBuffer());

  let text = "";
  if (ext === "pdf") {
    text = await extractPdfText(buffer);
  } else if (TEXT_EXTS.includes(ext)) {
    text = extractTextFile(buffer);
  } else {
    return NextResponse.json(
      { error: "Nem támogatott fájltípus. Kérjük, PDF vagy .txt fájlt töltsön fel." },
      { status: 400 }
    );
  }

  if (!text) {
    return NextResponse.json(
      {
        error:
          "Nem található kinyerhető szöveg. Ez a PDF valószínűleg beszkennelt kép – illessze be inkább a szöveget (az OCR hamarosan elérhető).",
      },
      { status: 422 }
    );
  }

  const title =
    (typeof titleField === "string" && titleField.trim()) || name.replace(/\.[^.]+$/, "");
  const mode = form.get("mode") === "pre_sign" ? "pre_sign" : "post_sign";

  const contract = await createContract({
    user_id: user.id,
    title,
    filename: name,
    raw_text: text,
    mode,
  });

  // Analyze in the background so the request returns immediately; the report
  // page shows "Analyzing…" and polls until the contract status changes.
  void runAnalysis(contract.id, user.id, text, mode).catch((err) => {
    console.error("[analyze] background failed:", err);
    setContractError(contract.id, err instanceof Error ? err.message : "Az elemzés nem sikerült.");
  });

  return NextResponse.json({ id: contract.id, status: "analyzing" });
}

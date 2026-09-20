import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createContract, listContracts, setContractError } from "@/lib/db";
import { runAnalysis } from "@/lib/analyze";
import { extractPdfText, extractTextFile } from "@/lib/parseDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const TEXT_EXTS = ["txt", "md", "text"];
const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp"];
const MAX_IMAGES = 20;

function imageMediaType(ext: string): string {
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Érvénytelen adat." }, { status: 400 });

  const titleField = form.get("title");
  const files = form
    .getAll("file")
    .filter(
      (f): f is File => typeof f !== "string" && typeof (f as unknown as { arrayBuffer?: unknown }).arrayBuffer === "function"
    );

  if (files.length === 0) {
    return NextResponse.json({ error: "Nincs megadva fájl." }, { status: 400 });
  }

  const images: { data: string; mediaType: string }[] = [];
  let docText = "";
  let firstName = "contract";

  for (const file of files) {
    const name = typeof (file as unknown as { name?: string }).name === "string" ? (file as unknown as { name: string }).name : "contract";
    if (firstName === "contract") firstName = name;
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const buffer = Buffer.from(await (file as unknown as { arrayBuffer(): Promise<ArrayBuffer> }).arrayBuffer());

    if (IMAGE_EXTS.includes(ext)) {
      images.push({ data: buffer.toString("base64"), mediaType: imageMediaType(ext) });
    } else if (ext === "pdf") {
      docText += (docText ? "\n\n" : "") + (await extractPdfText(buffer));
    } else if (TEXT_EXTS.includes(ext)) {
      docText += (docText ? "\n\n" : "") + extractTextFile(buffer);
    } else {
      return NextResponse.json(
        { error: "Nem támogatott fájltípus. PDF, .txt vagy kép (JPG/PNG/WebP) tölthető fel." },
        { status: 400 }
      );
    }
  }

  if (images.length > MAX_IMAGES) {
    return NextResponse.json(
      { error: `Legfeljebb ${MAX_IMAGES} képet tölthet fel egyszerre.` },
      { status: 400 }
    );
  }

  if (images.length === 0 && !docText) {
    return NextResponse.json(
      {
        error:
          "Nem található kinyerhető szöveg. Ez a PDF valószínűleg beszkennelt kép – töltsön fel fényképet, vagy illessze be a szöveget.",
      },
      { status: 422 }
    );
  }

  const title =
    (typeof titleField === "string" && titleField.trim()) || firstName.replace(/\.[^.]+$/, "");
  const mode = form.get("mode") === "pre_sign" ? "pre_sign" : "post_sign";
  const plan = user.plan || "free";

  if (plan !== "pro" && (await listContracts(user.id)).length >= 1) {
    return NextResponse.json(
      { error: "Az ingyenes csomag 1 szerződést engedélyez. Frissíts Pro-ra a korlátlan használathoz." },
      { status: 402 }
    );
  }

  const rawText =
    images.length > 0
      ? `[Kép alapú szerződés – ${images.length} fénykép]${docText ? "\n\n" + docText : ""}`
      : docText;

  const contract = await createContract({
    user_id: user.id,
    title,
    filename: firstName,
    raw_text: rawText,
    mode,
  });

  try {
    const summary = await runAnalysis(contract.id, user.id, docText, mode, plan, images);
    return NextResponse.json({ id: contract.id, ...summary });
  } catch (err) {
    console.error("[analyze] failed:", err);
    await setContractError(contract.id, err instanceof Error ? err.message : "Az elemzés nem sikerült.");
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Az elemzés nem sikerült." },
      { status: 502 }
    );
  }
}

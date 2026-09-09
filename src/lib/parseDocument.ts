import { extractText } from "unpdf";

/**
 * Extract plain text from a PDF buffer using unpdf (wraps Mozilla's pdf.js).
 * Returns "" when no text is found (e.g. a scanned/image-only PDF).
 */
export async function extractPdfText(buffer: Buffer | Uint8Array): Promise<string> {
  const data = Uint8Array.from(buffer);
  const result = await extractText(data, { mergePages: true });
  const text =
    typeof result === "string"
      ? result
      : Array.isArray(result?.text)
      ? result.text.join("\n")
      : (result?.text ?? "");
  return text.trim();
}

export function extractTextFile(buffer: Buffer): string {
  return buffer.toString("utf8").trim();
}

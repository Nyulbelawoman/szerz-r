// Közös email-küldés (Resend). A reminders/run és az elemzés is ezt használja.
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.MAIL_FROM || "SzerzŐr <alerts@szerzor.com>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error("[resend] hiba:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[resend] kudarc:", err);
    return false;
  }
}

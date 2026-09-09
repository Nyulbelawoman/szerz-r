import { NextResponse } from "next/server";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Adjon meg érvényes e-mail-címet." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "A jelszónak legalább 8 karakteresnek kell lennie." }, { status: 400 });
    }
    if (await getUserByEmail(email)) {
      return NextResponse.json({ error: "Ez az e-mail-cím már regisztrálva van." }, { status: 409 });
    }

    const user = await createUser(email, hashPassword(password));
    await setSessionCookie(user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[signup] hiba:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ismeretlen hiba" },
      { status: 500 }
    );
  }
}

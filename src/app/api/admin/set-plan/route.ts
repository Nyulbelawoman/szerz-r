import { NextResponse } from "next/server";
import { listUsersWithContracts, setUserPlanByEmail } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const plan = body?.plan === "pro" ? "pro" : "free";

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Hibás admin jelszó." }, { status: 401 });
  }
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Add meg az e-mail címet." }, { status: 400 });
  }

  await setUserPlanByEmail(email, plan);
  const users = await listUsersWithContracts();
  return NextResponse.json({ ok: true, plan, users });
}

export async function GET(req: Request) {
  const auth = req.headers.get("x-admin-password") || "";
  if (!process.env.ADMIN_PASSWORD || auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Hibás admin jelszó." }, { status: 401 });
  }
  const users = await listUsersWithContracts();
  return NextResponse.json({ users });
}

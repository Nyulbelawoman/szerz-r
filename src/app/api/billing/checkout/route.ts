import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const plan = url.searchParams.get("plan") === "everything" ? "everything" : "pro";
  const priceId =
    plan === "everything"
      ? process.env.STRIPE_PRICE_ID_EVERYTHING
      : process.env.STRIPE_PRICE_ID_PRO;

  if (!process.env.STRIPE_SECRET_KEY || !priceId) {
    return NextResponse.json(
      {
        message: `Billing is not configured yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_${plan.toUpperCase()} in .env.local to enable the ${
          plan === "everything" ? "$20 Everything" : "$9 Pro"
        } checkout.`,
      },
      { status: 501 }
    );
  }

  // Production:
  // const session = await stripe.checkout.sessions.create({
  //   mode: "subscription",
  //   line_items: [{ price: priceId, quantity: 1 }],
  //   success_url: `${process.env.APP_URL}/dashboard?upgraded=1`,
  //   cancel_url: `${process.env.APP_URL}/#pricing`,
  // });
  return NextResponse.json({ plan, priceId, message: "Stripe integration point ready." });
}

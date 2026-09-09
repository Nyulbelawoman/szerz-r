import { setUserPlanByEmail } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Gumroad "ping" webhook. Gumroad POSTs form-encoded data on every sale
 * (and refund/cancellation). We upgrade the buyer's account to "pro" by email.
 *
 * IMPORTANT: the buyer must register on SzerzŐr with the SAME email they used
 * on Gumroad, otherwise we can't match them.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData().catch(() => null);
    if (!form) return new Response("OK", { status: 200 });

    const sellerId = form.get("seller_id");
    const email = form.get("email");
    const product = form.get("product_name") || form.get("product_permalink") || "";

    // Optional: ignore pings that aren't from our Gumroad account.
    if (process.env.GUMROAD_SELLER_ID && sellerId !== process.env.GUMROAD_SELLER_ID) {
      return new Response("OK", { status: 200 });
    }

    if (typeof email === "string" && email.includes("@")) {
      await setUserPlanByEmail(email, "pro");
      console.log(`[gumroad] upgraded ${email} to pro (${product})`);
    }
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[gumroad] webhook error:", err);
    return new Response("OK", { status: 200 });
  }
}

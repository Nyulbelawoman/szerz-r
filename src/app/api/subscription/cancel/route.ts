import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { setUserPlanByEmail, setUserSubscriptionId } from "@/lib/db";
import { cancelGumroadSubscription } from "@/lib/gumroad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lemondja a bejelentkezett felhasználó Pro előfizetését:
 * 1. lemondja a Gumroadnál (megállítja a havi számlázást),
 * 2. visszaállítja a SzerzŐr fiókját "free" szintre.
 */
export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.plan !== "pro") {
    return NextResponse.json({ error: "Nincs aktív Pro előfizetés." }, { status: 400 });
  }

  // Ha van Gumroad subscription id, előbb azt mondjuk le a Gumroadnál.
  if (user.gumroad_subscription_id) {
    const result = await cancelGumroadSubscription(user.gumroad_subscription_id);
    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A lemondás a Gumroadnál nem sikerült (" +
            (result.message || "ismeretlen hiba") +
            "). A számlázás ezért még aktív — kérjük, vedd fel velünk a kapcsolatot.",
        },
        { status: 502 }
      );
    }
  }

  // Lecsökkentjük a fiókot free-re, és töröljük a subscription id-t.
  await setUserPlanByEmail(user.email, "free");
  if (user.gumroad_subscription_id) {
    await setUserSubscriptionId(user.email, "");
  }

  return NextResponse.json({
    success: true,
    message:
      "Az előfizetésed lemondva — a havi számlázás megszűnt. A fiókod mostantól Ingyenes.",
  });
}

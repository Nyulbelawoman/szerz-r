// Gumroad API hívás az előfizetés lemondására.
export async function cancelGumroadSubscription(
  subscriptionId: string
): Promise<{ ok: boolean; message?: string }> {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) {
    return { ok: false, message: "Nincs GUMROAD_ACCESS_TOKEN beállítva a szerveren." };
  }
  if (!subscriptionId) {
    return { ok: false, message: "Nincs subscription_id." };
  }

  try {
    // 1) Először Bearer tokenként próbáljuk (újabb API).
    let res = await fetch(`https://api.gumroad.com/v2/subscriptions/${subscriptionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2) Ha nem sikerült, próbáljuk access_token query paraméterrel (klasszikus v2 API).
    if (!res.ok) {
      res = await fetch(
        `https://api.gumroad.com/v2/subscriptions/${subscriptionId}?access_token=${encodeURIComponent(token)}`,
        { method: "DELETE" }
      );
    }

    if (res.ok) return { ok: true };
    const body = await res.text().catch(() => "");
    return { ok: false, message: `Gumroad HTTP ${res.status}: ${body.slice(0, 140)}` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Ismeretlen hiba" };
  }
}

// Meta Pixel események küldése (csak akkor fut, ha a Pixel már betöltött).
export function trackPixel(event: string, params?: Record<string, unknown>) {
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq === "function") {
    w.fbq("track", event, params);
  }
}

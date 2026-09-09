"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * While a contract is still "analyzing", refresh the page every few seconds
 * so the report appears automatically once the background analysis finishes.
 */
export default function PollAnalysis({ status }: { status: string }) {
  const router = useRouter();

  useEffect(() => {
    if (status !== "analyzing") return;
    const timer = setInterval(() => router.refresh(), 4000);
    return () => clearInterval(timer);
  }, [status, router]);

  return null;
}

import { AnalysisResult, Deadline, Flag, Severity } from "./types";
import { randomUUID } from "node:crypto";

const MODEL = process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT = `You are the contract-analysis engine for "SzerzŐr", a consumer app that helps ordinary people understand contracts they already signed and avoid "traps" (unfair, risky, or buried clauses).

Analyze the provided contract and return a single JSON object with this EXACT structure:

{
  "summary": "2-4 sentence plain-English summary of what this contract is and how fair it seems",
  "overallSeverity": "critical" | "high" | "medium" | "low",
  "flags": [
    {
      "category": "one of: auto-renewal, price-increase, early-termination-fee, cancellation-window, arbitration, class-action-waiver, jury-waiver, unilateral-changes, liability-waiver, indemnification, non-refundable, late-fee, auto-payment, data-sharing, non-compete, rent-increase, security-deposit, notice-period, other",
      "severity": "critical" | "high" | "medium" | "low",
      "title": "short title, e.g. 'Auto-renewal'",
      "quotedText": "the EXACT sentence(s) from the contract containing the trap, copied verbatim",
      "explanation": "plain-English explanation of the risk, written for a non-lawyer",
      "negotiationTip": "what the person can do about it — negotiate, ask to remove, or set a reminder",
      "moneyImpact": "a concrete estimate of the financial impact using figures from the contract, e.g. 'Could lock you into another $22,200/year' or '1%/day late interest = 365%/year'. Return null if the clause is not financial."
    }
  ],
  "deadlines": [
    {
      "label": "e.g. 'Cancel before auto-renewal' or 'Opt out of arbitration'",
      "type": "renewal | notice | expiration | payment | trial-end | opt-out | other",
      "date": "the calendar date AS STATED in the contract (e.g. the end/expiration date) as ISO YYYY-MM-DD, otherwise null. Do NOT subtract the notice period here.",
      "noticeDays": "integer number of days notice required if stated, otherwise null",
      "sourceText": "the sentence stating the deadline or date, copied verbatim",
      "severity": "critical" | "high" | "medium" | "low"
    }
  ]
}

Rules:
- Write everything for a non-lawyer. No legal jargon. Be specific and concrete.
- Keep it concise so the whole JSON fits the output limit: summary in 2-3 sentences, each explanation and tip in 1-2 sentences, and if there are more issues, report the 12 most important flags and 8 most important deadlines.
- For each flag's moneyImpact, use concrete figures from the contract (rent, fees, rates, deposits) and be specific — "another $22,200/year", "1%/day ≈ 365%/year" — not vague words like "a lot".
- Mindig magyarul válaszoljon (a summary, az explanation és a tip szövegeit), de a quotedText és a sourceText maradjon az eredeti szerződés eredeti szövegén.
- Only flag clauses actually present in the text. If a category does not appear, do not include a flag for it.
- quotedText and sourceText MUST be verbatim from the contract (copy the exact characters).
- If there is a forced-arbitration clause, check for an opt-out window (often 30 days) and include an "opt-out" deadline with its date and noticeDays when derivable.
- For deadlines, put the RAW date stated in the contract into "date" and the notice window into "noticeDays"; the app computes the final act-by date itself (date minus noticeDays), so do NOT pre-subtract. Example: contract ends 2026-12-31 with 90 days notice -> date="2026-12-31", noticeDays=90.
- Return ONLY the JSON object. No markdown fences, no commentary before or after it.`;

const MODE_GUIDANCE: Record<string, string> = {
  pre_sign:
    "\n\nIMPORTANT CONTEXT: The user has NOT signed this contract yet — they are deciding whether to sign it. Focus on: (1) a clear overall recommendation (sign / sign only with changes / do not sign), (2) the most important clauses to negotiate, remove, or clarify before signing, and (3) concrete negotiation language they can use. Treat deadlines as secondary context.",
  post_sign:
    "\n\nIMPORTANT CONTEXT: The user has ALREADY signed this contract. Focus on: (1) what they are now locked into, (2) every deadline they must act on (cancellation windows, opt-outs, renewals, payments), and (3) how to exit or reduce harm. Deadlines and reminders are the priority.",
};

export async function analyzeWithClaude(
  text: string,
  mode: string = "post_sign",
  images?: { data: string; mediaType: string }[]
): Promise<AnalysisResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    if (images && images.length > 0) {
      return errorResult("A kép alapú elemzéshez API-kulcs szükséges.");
    }
    return demoAnalysis(text);
  }

  const hasImages = images && images.length > 0;
  const userContent: unknown = hasImages
    ? [
        ...images!.map((img) => ({
          type: "image",
          source: { type: "base64", media_type: img.mediaType, data: img.data },
        })),
        {
          type: "text",
          text:
            "Analyze the contract shown in the attached photos. Read all the text from every image (they may be multiple pages of the same contract), then return ONLY the JSON object described in the system prompt.",
        },
      ]
    : `Analyze the following contract text and return ONLY the JSON object described in the system prompt.\n\n<contract>\n${text.slice(0, 80000)}\n</contract>`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8192,
        temperature: 0,
        system: SYSTEM_PROMPT + (MODE_GUIDANCE[mode] || MODE_GUIDANCE.post_sign),
        messages: [
          {
            role: "user",
            content: userContent,
          },
        ],
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[claude] HTTP ${res.status}: ${body.slice(0, 500)}`);
      return errorResult(`Claude API hiba (${res.status}). ${humanizeClaudeError(res.status, body)}`);
    }

    const data = await res.json();
    const content = data?.content?.[0]?.text;
    if (typeof content !== "string") {
      console.error("[claude] unexpected response shape");
      return errorResult("A Claude váratlan választ adott. Próbálja újra.");
    }
    return parseAnalysis(content);
  } catch (err) {
    console.error("[claude] request failed:", err);
    return errorResult(err instanceof Error ? err.message : "Nem sikerült elérni a Claude API-t.");
  }
}

function errorResult(message: string): AnalysisResult {
  return {
    summary: "",
    overallSeverity: "info",
    flags: [],
    deadlines: [],
    provider: "error",
    error: message,
  };
}

function humanizeClaudeError(status: number, body: string): string {
  if (status === 401) return "A hitelesítés nem sikerült – ellenőrizze az ANTHROPIC_API_KEY kulcsot a .env.local fájlban.";
  if (status === 403) return "Ez az API-kulcs nem jogosult a modell használatára.";
  if (status === 429) return "Túl sok kérés – várjon egy kicsit, és próbálja újra.";
  if (status === 400 && /credit|billing|balance/i.test(body)) {
    return "Az Anthropic-fiókján nincs egyenleg. Töltsön fel egyenleget a console.anthropic.com oldalon (Plans & Billing), majd próbálja újra ezt az elemzést.";
  }
  if (status >= 500) return "Az Anthropic jelenleg kimarad – próbálja újra később.";
  return body.slice(0, 160);
}

function parseAnalysis(raw: string): AnalysisResult {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("A Claude nem adott vissza érvényes JSON-t.");
  }
  const json = JSON.parse(raw.slice(start, end + 1));

  const flags: Flag[] = Array.isArray(json.flags)
    ? json.flags.map((f: any) => coerceFlag(f)).filter(Boolean)
    : [];
  const deadlines: Deadline[] = Array.isArray(json.deadlines)
    ? json.deadlines.map((d: any) => coerceDeadline(d)).filter(Boolean)
    : [];

  return {
    summary: typeof json.summary === "string" ? json.summary : "",
    overallSeverity: coerceSeverity(json.overallSeverity),
    flags,
    deadlines,
    provider: "claude",
  };
}

function coerceFlag(f: any): Flag | null {
  if (!f || typeof f !== "object") return null;
  if (!f.title && !f.explanation) return null;
  return {
    id: randomUUID(),
    category: typeof f.category === "string" ? f.category : "other",
    severity: coerceSeverity(f.severity),
    title: String(f.title ?? "Flagged clause"),
    quotedText: String(f.quotedText ?? ""),
    explanation: String(f.explanation ?? ""),
    negotiationTip: f.negotiationTip ? String(f.negotiationTip) : undefined,
    moneyImpact: f.moneyImpact ? String(f.moneyImpact) : undefined,
  };
}

function coerceDeadline(d: any): Deadline | null {
  if (!d || typeof d !== "object") return null;
  if (!d.label && !d.sourceText) return null;
  return {
    id: randomUUID(),
    label: String(d.label ?? "Deadline"),
    type: typeof d.type === "string" ? d.type : "other",
    date: d.date ? String(d.date) : null,
    noticeDays: Number.isFinite(Number(d.noticeDays)) ? Number(d.noticeDays) : null,
    actByDate: null,
    sourceText: d.sourceText ? String(d.sourceText) : null,
    severity: coerceSeverity(d.severity),
    status: "open",
  };
}

function coerceSeverity(v: any): Severity {
  const s = String(v ?? "medium").toLowerCase();
  if (["critical", "high", "medium", "low", "info"].includes(s)) return s as Severity;
  return "medium";
}

export async function generateLetter(
  text: string,
  flags: { title: string; negotiationTip?: string | null; moneyImpact?: string | null }[],
  mode: string
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  const flagLines = flags
    .map(
      (f) =>
        `- ${f.title}${f.negotiationTip ? `: ${f.negotiationTip}` : ""}${
          f.moneyImpact ? ` (${f.moneyImpact})` : ""
        }`
    )
    .join("\n");

  if (!key) return fallbackLetter(flagLines, mode);

  const instruction =
    mode === "pre_sign"
      ? "Write a polite, professional message the user can send to the OTHER PARTY requesting changes BEFORE signing. Reference each issue below and ask for it to be removed or revised. Keep it under 180 words, first-person, magyarul. Frame everything as requests or questions, never legal demands. Return ONLY the message text with no commentary."
      : "Write a short, formal notice the user can send to EXERCISE their rights under a contract they ALREADY signed (opt out of arbitration, give cancellation notice, request a deposit return, etc.). Include the specific actions and deadlines below. Keep it under 180 words, first-person, magyarul. Return ONLY the message text with no commentary.";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        temperature: 0.3,
        system: instruction,
        messages: [
          {
            role: "user",
            content: `Contract (excerpt):\n${text.slice(0, 15000)}\n\nIssues to address:\n${
              flagLines || "(none provided)"
            }`,
          },
        ],
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (/credit|billing|balance/i.test(body)) {
        return "⚠️ A levél nem érhető el – az Anthropic-fiókján nincs egyenleg. Töltsön fel egyenleget a console.anthropic.com oldalon, majd próbálja újra.";
      }
      return fallbackLetter(flagLines, mode);
    }

    const data = await res.json();
    const content = data?.content?.[0]?.text;
    return typeof content === "string" && content.trim()
      ? content.trim()
      : fallbackLetter(flagLines, mode);
  } catch {
    return fallbackLetter(flagLines, mode);
  }
}

function fallbackLetter(flagLines: string, mode: string): string {
  if (mode === "pre_sign") {
    return `Tisztelt Címzett!\n\nAláírás előtt szeretnék néhány módosítást kérni a szerződésben:\n\n${flagLines || "- (nézze át a megjelölt pontokat)"}\n\nMeg tudnánk beszélni ezek módosítását?\n\nÜdvözlettel,\n[Az Ön neve]`;
  }
  return `Tisztelt Címzett!\n\nEzúton szeretném érvényesíteni a szerződés szerinti jogaimat:\n\n${flagLines || "- (lásd a megjelölt határidőket)"}\n\nKérem, igazolja vissza a beérkezést és a következő lépéseket.\n\nÜdvözlettel,\n[Az Ön neve]`;
}

// ---------------------------------------------------------------------------
// Demo analyzer — runs when there is no ANTHROPIC_API_KEY (or Claude errors).
// Keyword-based, so the full end-to-end flow works without credentials.
// ---------------------------------------------------------------------------

function demoAnalysis(text: string): AnalysisResult {
  const flags: Flag[] = [];
  const deadlines: Deadline[] = [];
  const t = text.toLowerCase();

  const add = (
    category: string,
    severity: Severity,
    title: string,
    quotedText: string,
    explanation: string,
    negotiationTip: string
  ) => {
    if (!quotedText) return;
    flags.push({
      id: randomUUID(),
      category,
      severity,
      title,
      quotedText,
      explanation,
      negotiationTip,
    });
  };

  // Auto-renewal / evergreen
  if (/auto[ -]?renew|automatic(?:ally)?[ -]?renew|renews automatically|evergreen|renewal term/i.test(t)) {
    add(
      "auto-renewal",
      "high",
      "Auto-renewal",
      grab(t, /[^.]*auto[ -]?renew[^.]*\./i) ||
        grab(t, /[^.]*automatic(?:ally)?[ -]?renew[^.]*\./i),
      "This contract renews automatically unless you cancel in time. You could be locked in and charged again without meaning to.",
      "Ask to remove auto-renewal, or at minimum confirm the exact notice window and set a reminder before that date."
    );
  }

  // Forced arbitration + opt-out
  if (/\barbitration\b|arbitrate/i.test(t)) {
    const optOut = /opt[- ]out/i.test(t);
    add(
      "arbitration",
      optOut ? "high" : "critical",
      "Forced arbitration" + (optOut ? " (you can opt out)" : ""),
      grab(t, /[^.]*arbitration[^.]*\./i),
      optOut
        ? "This contract forces disputes into arbitration instead of court, but it appears to let you opt out. If you miss the opt-out window, you may give up your right to sue."
        : "This contract forces disputes into private arbitration instead of court, which usually means you give up the right to sue or join a class action.",
      optOut
        ? "Send the opt-out notice before the deadline — often within 30 days. We've flagged the date below."
        : "Ask whether arbitration is mandatory and whether you can opt out."
    );
    if (optOut) {
      deadlines.push({
        id: randomUUID(),
        label: "Opt out of arbitration",
        type: "opt-out",
        date: null,
        noticeDays: 30,
        actByDate: null,
        sourceText: grab(t, /[^.]*opt[- ]out[^.]*\./i),
        severity: "high",
        status: "open",
      });
    }
  }

  // Class action waiver
  if (/class[- ]action/i.test(t)) {
    add(
      "class-action-waiver",
      "high",
      "Class-action waiver",
      grab(t, /[^.]*class[- ]action[^.]*\./i),
      "You may be giving up the right to join a class-action lawsuit, which is often the only practical way to fight a big company over a small amount.",
      "Check if this waiver is tied to arbitration and whether you can opt out of both."
    );
  }

  // Cancellation notice window
  if (/written notice|notice of|days[’']? notice|notice period|cancell?ation/i.test(t)) {
    add(
      "cancellation-window",
      "high",
      "Cancellation notice window",
      grab(t, /[^.]*notice[^.]*\./i),
      "You may have to give advance written notice to cancel, and missing it can trigger another full term or a fee.",
      "Note the exact number of days and the method (certified mail, email, in person) — we've added a reminder for it."
    );
  }

  // Early termination fee
  if (/early termination|termination fee|early[- ]termination/i.test(t)) {
    add(
      "early-termination-fee",
      "medium",
      "Early-termination fee",
      grab(t, /[^.]*early termination[^.]*\./i),
      "Leaving early may cost you a penalty. This is common with phone, internet, and gym contracts.",
      "Know the exact amount and when it phases out (often after 12 or 24 months)."
    );
  }

  // Price increase
  if (/increase|price may|rate may|we may change|subject to change|adjust/i.test(t)) {
    add(
      "price-increase",
      "medium",
      "Possible price increase",
      grab(t, /[^.]*(?:increase|subject to change|we may change)[^.]*\./i),
      "The price or terms can go up later, sometimes with only short notice.",
      "Ask how much notice you'll get and whether you can cancel without penalty if the price rises."
    );
  }

  // Auto-payment
  if (/automatic payment|auto[ -]?pay|automatically charge|recurring payment|direct debit|ach\b/i.test(t)) {
    add(
      "auto-payment",
      "medium",
      "Automatic payment authorization",
      grab(t, /[^.]*(?:automatic payment|recurring payment|auto[ -]?pay)[^.]*\./i),
      "You're authorizing automatic charges, so you may keep being billed even after you stop using the service.",
      "Keep your payment method updated and review statements; cancel in writing to create a paper trail."
    );
  }

  // Non-refundable
  if (/non[- ]refundable|no refund|all sales final/i.test(t)) {
    add(
      "non-refundable",
      "medium",
      "Non-refundable payment",
      grab(t, /[^.]*non[- ]refundable[^.]*\./i),
      "This money likely won't come back if you change your mind or the deal falls through.",
      "Before paying, confirm exactly what happens to the money in each cancellation scenario."
    );
  }

  // Late fee
  if (/late fee|late payment|overdue|penalty/i.test(t)) {
    add(
      "late-fee",
      "low",
      "Late-payment penalty",
      grab(t, /[^.]*late (?:fee|payment)[^.]*\./i),
      "Paying late can trigger fees or interest, and sometimes a default on the whole agreement.",
      "Set a payment reminder; ask if there's a grace period."
    );
  }

  // Liability waiver
  if (/not liable|no liability|assume all risk|waive|at your own risk|indemnif/i.test(t)) {
    add(
      "liability-waiver",
      "high",
      "Liability waiver / indemnification",
      grab(t, /[^.]*(?:not liable|assume all risk|indemnif)[^.]*\./i),
      "You may be giving up rights to hold the other party responsible if something goes wrong — or agreeing to cover their costs.",
      "This is often negotiable. Ask them to limit it or make it mutual."
    );
  }

  // Unilateral changes
  if (/we may (?:change|modify|amend|update)|we reserve the right|at our sole discretion/i.test(t)) {
    add(
      "unilateral-changes",
      "high",
      "One-sided changes",
      grab(t, /[^.]*we (?:may|reserve the right)[^.]*\./i),
      "The company can change the terms on you later without your agreement.",
      "Ask for advance notice and the right to cancel if the terms change in a way you don't like."
    );
  }

  // Security deposit
  if (/security deposit|deposit/i.test(t)) {
    add(
      "security-deposit",
      "medium",
      "Security deposit terms",
      grab(t, /[^.]*security deposit[^.]*\./i),
      "Know exactly how and when the deposit is returned, and what can be deducted.",
      "Document the condition at move-in and confirm the return deadline."
    );
  }

  // Rent increase
  if (/rent increase|rent may|rental amount|monthly rent/i.test(t)) {
    add(
      "rent-increase",
      "medium",
      "Rent increase clause",
      grab(t, /[^.]*rent[^.]*(?:increase|may)[^.]*\./i),
      "Your rent can go up, possibly with limited notice.",
      "Confirm the maximum increase and the notice period required."
    );
  }

  // Notice windows -> deadlines (generic scan)
  const noticeRe = /(\d{1,3})\s*(?:calendar\s*)?days?[’']?\s*(?:prior\s+to|before|written\s+notice|notice)/gi;
  let m: RegExpExecArray | null;
  const seen = new Set<number>();
  while ((m = noticeRe.exec(t)) !== null) {
    const days = parseInt(m[1], 10);
    if (seen.has(days)) continue;
    seen.add(days);
    deadlines.push({
      id: randomUUID(),
      label: `${days}-day notice deadline`,
      type: "notice",
      date: null,
      noticeDays: days,
      actByDate: null,
      sourceText: grab(t, new RegExp(m[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")),
      severity: "medium",
      status: "open",
    });
  }

  // Explicit dates -> deadlines
  const dateRe =
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/gi;
  const monthNum: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  };
  const dm: RegExpExecArray | null = null;
  let dm2: RegExpExecArray | null;
  const dateSeen = new Set<string>();
  while ((dm2 = dateRe.exec(t)) !== null) {
    const iso = `${dm2[3]}-${String(monthNum[dm2[1].toLowerCase()]).padStart(2, "0")}-${String(dm2[2]).padStart(2, "0")}`;
    if (dateSeen.has(iso)) continue;
    dateSeen.add(iso);
    const context = t.slice(Math.max(0, dm2.index - 60), dm2.index + 40);
    const label = /expir/i.test(context)
      ? "Contract expiration"
      : /renew/i.test(context)
      ? "Renewal date"
      : /effective/i.test(context)
      ? "Effective date"
      : "Contract date";
    deadlines.push({
      id: randomUUID(),
      label,
      type: /expir/i.test(context) ? "expiration" : /renew/i.test(context) ? "renewal" : "other",
      date: iso,
      noticeDays: null,
      actByDate: null,
      sourceText: context.replace(/\s+/g, " ").trim(),
      severity: "medium",
      status: "open",
    });
  }

  // Severity ordering
  const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  flags.sort((a, b) => order[a.severity] - order[b.severity]);
  deadlines.sort((a, b) => (a.actByDate || a.date || "").localeCompare(b.actByDate || b.date || ""));

  const overall = flags.reduce<Severity>((worst, f) => (order[f.severity] < order[worst] ? f.severity : worst), "low");

  return {
    summary:
      flags.length > 0
        ? `Találtunk ${flags.length} lehetséges problémát – de ez csak a KORLÁTOZOTT kulcsszavas demó (nincs API-kulcs beállítva). Csak az angolt érti, és a legtöbb csapdát kihagyja, ezért ezt csak durva jelzésnek tekintse, nem valódi elemzésnek.`
        : "Demó mód: nincs API-kulcs beállítva, ezért ez csak egy korlátozott angol nyelvű kulcsszavas vizsgálat volt. Nem tudta ténylegesen elemezni ezt a szerződést (különösen magyar nyelvűt). Adja meg az ANTHROPIC_API_KEY kulcsot a .env.local fájlban, és indítsa újra a valódi AI-elemzéshez.",
    overallSeverity: overall,
    flags,
    deadlines,
    provider: "demo",
  };
}

function grab(text: string, re: RegExp, ctx = 160): string {
  const m = text.match(re);
  if (!m) return "";
  const idx = m.index ?? 0;
  return text.slice(Math.max(0, idx - 40), idx + ctx).replace(/\s+/g, " ").trim();
}

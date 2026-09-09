export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type SignMode = "pre_sign" | "post_sign";

export interface Flag {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  quotedText: string;
  explanation: string;
  negotiationTip?: string;
  moneyImpact?: string;
}

export interface Deadline {
  id: string;
  label: string;
  type: string;
  date?: string | null;
  noticeDays?: number | null;
  actByDate?: string | null;
  sourceText?: string | null;
  severity: Severity;
  status: "open" | "handled";
}

export interface AnalysisResult {
  summary: string;
  overallSeverity: Severity;
  flags: Flag[];
  deadlines: Deadline[];
  provider: "claude" | "demo" | "error";
  error?: string;
}

export interface ContractWithStats {
  id: string;
  title: string;
  filename: string | null;
  status: string;
  created_at: string;
  flag_count: number;
  open_deadline_count: number;
  next_act_by: string | null;
  overall_severity: Severity | null;
}

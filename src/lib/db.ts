import { Pool } from "pg";
import { randomUUID } from "node:crypto";

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  plan: string;
  created_at: string;
  gumroad_subscription_id?: string | null;
}

export interface ContractRow {
  id: string;
  user_id: string;
  title: string;
  filename: string | null;
  raw_text: string;
  status: string;
  summary: string | null;
  overall_severity: string | null;
  provider: string | null;
  mode: string;
  error: string | null;
  created_at: string;
}

export interface FlagRow {
  id: string;
  contract_id: string;
  category: string;
  severity: string;
  title: string;
  quoted_text: string | null;
  explanation: string;
  negotiation_tip: string | null;
  money_impact: string | null;
  sort_order: number;
}

export interface DeadlineRow {
  id: string;
  contract_id: string;
  label: string;
  type: string;
  date: string | null;
  notice_days: number | null;
  act_by_date: string | null;
  source_text: string | null;
  severity: string;
  status: string;
}

export interface ReminderRow {
  id: string;
  deadline_id: string;
  user_id: string;
  remind_at: string;
  tier_days: number;
  sent: number;
}

export interface ContractListRow {
  id: string;
  title: string;
  filename: string | null;
  status: string;
  provider: string | null;
  mode: string | null;
  created_at: string;
  flag_count: number;
  open_deadline_count: number;
  next_act_by: string | null;
}

export interface UpcomingDeadlineRow {
  deadline_id: string;
  contract_id: string;
  contract_title: string;
  label: string;
  severity: string;
  act_by_date: string | null;
  date: string | null;
}

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL nincs beállítva");
    pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

let migrated = false;

async function ensureMigrated() {
  if (migrated) return;
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'free',
      created_at TEXT NOT NULL
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS gumroad_subscription_id TEXT;

    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      filename TEXT,
      raw_text TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'analyzing',
      summary TEXT,
      overall_severity TEXT,
      provider TEXT,
      mode TEXT NOT NULL DEFAULT 'post_sign',
      error TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS flags (
      id TEXT PRIMARY KEY,
      contract_id TEXT NOT NULL,
      category TEXT NOT NULL,
      severity TEXT NOT NULL,
      title TEXT NOT NULL,
      quoted_text TEXT,
      explanation TEXT NOT NULL,
      negotiation_tip TEXT,
      money_impact TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS deadlines (
      id TEXT PRIMARY KEY,
      contract_id TEXT NOT NULL,
      label TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT,
      notice_days INTEGER,
      act_by_date TEXT,
      source_text TEXT,
      severity TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'open'
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      deadline_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      remind_at TEXT NOT NULL,
      tier_days INTEGER NOT NULL,
      sent INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_contracts_user ON contracts(user_id);
    CREATE INDEX IF NOT EXISTS idx_flags_contract ON flags(contract_id);
    CREATE INDEX IF NOT EXISTS idx_deadlines_contract ON deadlines(contract_id);
    CREATE INDEX IF NOT EXISTS idx_reminders_due ON reminders(sent, remind_at);
  `);
  migrated = true;
}

async function q(sql: string, params: unknown[] = []): Promise<any[]> {
  await ensureMigrated();
  const { rows } = await getPool().query(sql, params);
  return rows;
}

// ---- users ----

export async function createUser(email: string, passwordHash: string): Promise<UserRow> {
  const id = randomUUID();
  await q(
    "INSERT INTO users (id, email, password_hash, plan, created_at) VALUES ($1, $2, $3, 'free', $4)",
    [id, email.toLowerCase(), passwordHash, new Date().toISOString()]
  );
  return (await getUserById(id))!;
}

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
  const rows = await q("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
  return rows[0] as UserRow | undefined;
}

export async function getUserById(id: string): Promise<UserRow | undefined> {
  const rows = await q("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] as UserRow | undefined;
}

export async function setUserPlanByEmail(email: string, plan: string) {
  await q("UPDATE users SET plan = $1 WHERE email = $2", [plan, email.toLowerCase()]);
}

export async function setUserSubscriptionId(email: string, subscriptionId: string) {
  await q("UPDATE users SET gumroad_subscription_id = $1 WHERE email = $2", [
    subscriptionId,
    email.toLowerCase(),
  ]);
}

export async function listUsers(): Promise<UserRow[]> {
  return (await q("SELECT id, email, plan, created_at FROM users ORDER BY created_at DESC")) as UserRow[];
}

// ---- contracts ----

export async function createContract(input: {
  user_id: string;
  title: string;
  filename?: string | null;
  raw_text: string;
  mode?: string;
}): Promise<ContractRow> {
  const id = randomUUID();
  await q(
    "INSERT INTO contracts (id, user_id, title, filename, raw_text, mode, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, 'analyzing', $7)",
    [
      id,
      input.user_id,
      input.title,
      input.filename ?? null,
      input.raw_text,
      input.mode ?? "post_sign",
      new Date().toISOString(),
    ]
  );
  return (await getContract(id))!;
}

export async function getContract(id: string): Promise<ContractRow | undefined> {
  const rows = await q("SELECT * FROM contracts WHERE id = $1", [id]);
  return rows[0] as ContractRow | undefined;
}

export async function setContractStatus(id: string, status: string) {
  await q("UPDATE contracts SET status = $1 WHERE id = $2", [status, id]);
}

export async function setContractResult(
  id: string,
  summary: string,
  overallSeverity: string,
  provider: string
) {
  await q(
    "UPDATE contracts SET summary = $1, overall_severity = $2, provider = $3, status = 'done' WHERE id = $4",
    [summary, overallSeverity, provider, id]
  );
}

export async function setContractError(id: string, message: string) {
  await q("UPDATE contracts SET status = 'error', error = $1 WHERE id = $2", [message, id]);
}

export async function clearContractError(id: string) {
  await q("UPDATE contracts SET error = NULL WHERE id = $1", [id]);
}

export async function deleteContract(id: string, userId: string): Promise<boolean> {
  const rows = await q("SELECT id FROM contracts WHERE id = $1 AND user_id = $2", [id, userId]);
  if (rows.length === 0) return false;

  await q("DELETE FROM reminders WHERE deadline_id IN (SELECT id FROM deadlines WHERE contract_id = $1)", [id]);
  await q("DELETE FROM deadlines WHERE contract_id = $1", [id]);
  await q("DELETE FROM flags WHERE contract_id = $1", [id]);
  await q("DELETE FROM contracts WHERE id = $1", [id]);
  return true;
}

export async function clearContractAnalysis(id: string) {
  await q("DELETE FROM reminders WHERE deadline_id IN (SELECT id FROM deadlines WHERE contract_id = $1)", [id]);
  await q("DELETE FROM deadlines WHERE contract_id = $1", [id]);
  await q("DELETE FROM flags WHERE contract_id = $1", [id]);
}

export async function listContracts(userId: string): Promise<ContractListRow[]> {
  return (await q(
    `SELECT c.id, c.title, c.filename, c.status, c.provider, c.mode, c.created_at,
       (SELECT COUNT(*) FROM flags f WHERE f.contract_id = c.id) AS flag_count,
       (SELECT COUNT(*) FROM deadlines d WHERE d.contract_id = c.id AND d.status = 'open') AS open_deadline_count,
       (SELECT MIN(COALESCE(d.act_by_date, d.date)) FROM deadlines d WHERE d.contract_id = c.id AND d.status = 'open') AS next_act_by
     FROM contracts c
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  )) as ContractListRow[];
}

// ---- flags / deadlines / reminders ----

export async function insertFlag(f: Omit<FlagRow, "id">) {
  await q(
    "INSERT INTO flags (id, contract_id, category, severity, title, quoted_text, explanation, negotiation_tip, money_impact, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [
      randomUUID(),
      f.contract_id,
      f.category,
      f.severity,
      f.title,
      f.quoted_text,
      f.explanation,
      f.negotiation_tip,
      f.money_impact,
      f.sort_order,
    ]
  );
}

export async function getFlags(contractId: string): Promise<FlagRow[]> {
  return (await q("SELECT * FROM flags WHERE contract_id = $1 ORDER BY sort_order ASC", [contractId])) as FlagRow[];
}

export async function insertDeadline(d: Omit<DeadlineRow, "id" | "status">): Promise<string> {
  const id = randomUUID();
  await q(
    "INSERT INTO deadlines (id, contract_id, label, type, date, notice_days, act_by_date, source_text, severity, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'open')",
    [id, d.contract_id, d.label, d.type, d.date, d.notice_days, d.act_by_date, d.source_text, d.severity]
  );
  return id;
}

export async function getDeadlines(contractId: string): Promise<DeadlineRow[]> {
  return (await q(
    "SELECT * FROM deadlines WHERE contract_id = $1 ORDER BY COALESCE(act_by_date, date) ASC",
    [contractId]
  )) as DeadlineRow[];
}

export async function setDeadlineStatus(id: string, status: "open" | "handled") {
  await q("UPDATE deadlines SET status = $1 WHERE id = $2", [status, id]);
}

export async function insertReminder(r: Omit<ReminderRow, "id" | "sent">) {
  await q(
    "INSERT INTO reminders (id, deadline_id, user_id, remind_at, tier_days, sent) VALUES ($1, $2, $3, $4, $5, 0)",
    [randomUUID(), r.deadline_id, r.user_id, r.remind_at, r.tier_days]
  );
}

export async function getDueReminders(userId: string): Promise<ReminderRow[]> {
  const now = new Date().toISOString();
  return (await q(
    "SELECT * FROM reminders WHERE user_id = $1 AND sent = 0 AND remind_at <= $2 ORDER BY remind_at ASC",
    [userId, now]
  )) as ReminderRow[];
}

export async function getDueRemindersAll(): Promise<ReminderRow[]> {
  const now = new Date().toISOString();
  return (await q(
    "SELECT * FROM reminders WHERE sent = 0 AND remind_at <= $1 ORDER BY remind_at ASC",
    [now]
  )) as ReminderRow[];
}

export async function markReminderSent(id: string) {
  await q("UPDATE reminders SET sent = 1 WHERE id = $1", [id]);
}

export async function getDeadlineById(id: string): Promise<DeadlineRow | undefined> {
  const rows = await q("SELECT * FROM deadlines WHERE id = $1", [id]);
  return rows[0] as DeadlineRow | undefined;
}

export async function listUpcomingDeadlines(userId: string, limit = 20): Promise<UpcomingDeadlineRow[]> {
  return (await q(
    `SELECT d.id AS deadline_id, d.contract_id, c.title AS contract_title, d.label, d.severity, d.act_by_date, d.date
     FROM deadlines d
     JOIN contracts c ON c.id = d.contract_id
     WHERE c.user_id = $1 AND d.status = 'open'
       AND COALESCE(d.act_by_date, d.date) IS NOT NULL
     ORDER BY COALESCE(d.act_by_date, d.date) ASC
     LIMIT $2`,
    [userId, limit]
  )) as UpcomingDeadlineRow[];
}

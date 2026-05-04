// Save this file at: lib/supabase.ts (root of project, not inside app/)
import { createClient } from "@supabase/supabase-js";

// ── Client-side Supabase instance (uses anon key) ─────────────────────────
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Single client ID (swap for multi-client: read from auth session) ──────
export const CLIENT_ID = "a1b2c3d4-0000-0000-0000-000000000001";

// ── Typed helpers ─────────────────────────────────────────────────────────

export async function getEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("client_id", CLIENT_ID)
    .eq("active", true)
    .order("name");
  if (error) throw error;
  return data;
}

export async function getSOPs(search = "") {
  let query = supabase
    .from("sops")
    .select("*")
    .eq("client_id", CLIENT_ID)
    .order("updated_at", { ascending: false });
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getManuals(search = "") {
  let query = supabase
    .from("manuals")
    .select("*")
    .eq("client_id", CLIENT_ID)
    .order("updated_at", { ascending: false });
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTroubleshooting(search = "") {
  let query = supabase
    .from("troubleshooting")
    .select("*")
    .eq("client_id", CLIENT_ID);
  if (search) query = query.or(`title.ilike.%${search}%,symptom.ilike.%${search}%,solution.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getInspections() {
  const { data, error } = await supabase
    .from("inspections_with_status")   // uses our computed view
    .select("*")
    .eq("client_id", CLIENT_ID)
    .order("due_date");
  if (error) throw error;
  return data;
}

export async function getLicenses() {
  const { data, error } = await supabase
    .from("licenses_with_status")      // uses our computed view
    .select("*")
    .eq("client_id", CLIENT_ID)
    .order("expiry_date");
  if (error) throw error;
  return data;
}

export async function getVendors(search = "", category = "All") {
  let query = supabase
    .from("vendors")
    .select("*")
    .eq("client_id", CLIENT_ID)
    .order("name");
  if (search)           query = query.ilike("name", `%${search}%`);
  if (category !== "All") query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFaults(search = "") {
  let query = supabase
    .from("faults")
    .select("*")
    .eq("client_id", CLIENT_ID)
    .order("last_seen", { ascending: false });
  if (search) query = query.or(`title.ilike.%${search}%,code.ilike.%${search}%,symptom.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function savePayrollRun(payload: {
  period_label: string;
  period_start?: string;
  period_end?: string;
  total_amount: number;
  sent_to: string;
  email_body: string;
}) {
  const { data, error } = await supabase
    .from("payroll_runs")
    .insert({ ...payload, client_id: CLIENT_ID, sent_at: new Date().toISOString() });
  if (error) throw error;
  return data;
}

export async function addKnowledgeItem(table: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(table)
    .insert({ ...payload, client_id: CLIENT_ID });
  if (error) throw error;
  return data;
}
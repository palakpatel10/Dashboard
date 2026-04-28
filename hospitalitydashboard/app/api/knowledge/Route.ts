import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Table map — category → supabase table ─────────────────────────────────
const TABLE_MAP: Record<string, string> = {
  SOPs:            "sops",
  Manuals:         "manuals",
  Troubleshooting: "troubleshooting",
  Compliance:      "licenses",
  General:         "sops",
};

// ── POST /api/knowledge ───────────────────────────────────────────────────
// Saves a new knowledge item to the correct Supabase table
export async function POST(req: NextRequest) {
  try {
    const body     = await req.json();
    const { title, category, content, clientId } = body;

    if (!title || !category || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const table = TABLE_MAP[category] ?? "sops";

    // Build the insert payload based on the target table
    let payload: Record<string, unknown> = {
      client_id:  clientId,
      title,
      category,
    };

    if (table === "troubleshooting") {
      payload = { ...payload, symptom: content, solution: "See notes" };
    } else {
      // For sops/manuals we store content as notes (extend schema if needed)
      payload = { ...payload, status: "Active" };
    }

    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Knowledge insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error("Knowledge API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET /api/knowledge?q=search ───────────────────────────────────────────
// Searches across all knowledge tables for a query string
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q        = searchParams.get("q") ?? "";
    const clientId = searchParams.get("clientId") ?? "";

    if (!q) return NextResponse.json({ results: [] });

    // Search across all tables in parallel
    const [sops, manuals, troubleshooting, faults] = await Promise.all([
      supabase.from("sops").select("id, title, category").eq("client_id", clientId).ilike("title", `%${q}%`),
      supabase.from("manuals").select("id, title, category").eq("client_id", clientId).ilike("title", `%${q}%`),
      supabase.from("troubleshooting").select("id, title, symptom, solution").eq("client_id", clientId).or(`title.ilike.%${q}%,symptom.ilike.%${q}%`),
      supabase.from("faults").select("id, code, title, fix").eq("client_id", clientId).or(`title.ilike.%${q}%,symptom.ilike.%${q}%`),
    ]);

    const results = [
      ...(sops.data ?? []).map(r => ({ ...r, source: "SOP" })),
      ...(manuals.data ?? []).map(r => ({ ...r, source: "Manual" })),
      ...(troubleshooting.data ?? []).map(r => ({ ...r, source: "Troubleshooting" })),
      ...(faults.data ?? []).map(r => ({ ...r, source: "Fault Library" })),
    ];

    return NextResponse.json({ results });

  } catch (err) {
    console.error("Knowledge search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
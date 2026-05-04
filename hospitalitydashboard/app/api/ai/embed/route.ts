import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEmbedding, buildEmbeddingText } from "@/lib/embeddings";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── POST /api/ai/embed ────────────────────────────────────────────────────
// Run this ONCE to embed all existing knowledge items
// Then call it whenever new items are added
export async function POST(req: NextRequest) {
  try {
    const { clientId } = await req.json();

    let embedded = 0;
    const errors: string[] = [];

    // ── Fetch all knowledge tables ───────────────────────────────────────
    const [sops, manuals, troubleshooting, faults] = await Promise.all([
      supabase.from("sops").select("*").eq("client_id", clientId),
      supabase.from("manuals").select("*").eq("client_id", clientId),
      supabase.from("troubleshooting").select("*").eq("client_id", clientId),
      supabase.from("faults").select("*").eq("client_id", clientId),
    ]);

    // ── Build items list ─────────────────────────────────────────────────
    const items = [
      ...(sops.data ?? []).map(r => ({
        source_id:   r.id,
        source_type: "sop",
        title:       r.title,
        content:     buildEmbeddingText({ title: r.title, category: r.category }),
      })),
      ...(manuals.data ?? []).map(r => ({
        source_id:   r.id,
        source_type: "manual",
        title:       r.title,
        content:     buildEmbeddingText({ title: r.title, category: r.category }),
      })),
      ...(troubleshooting.data ?? []).map(r => ({
        source_id:   r.id,
        source_type: "troubleshooting",
        title:       r.title,
        content:     buildEmbeddingText({ title: r.title, symptom: r.symptom, solution: r.solution }),
      })),
      ...(faults.data ?? []).map(r => ({
        source_id:   r.id,
        source_type: "fault",
        title:       r.title,
        content:     buildEmbeddingText({ title: r.title, symptom: r.symptom, fix: r.fix }),
      })),
    ];

    // ── Clear old embeddings for this client ─────────────────────────────
    await supabase.from("knowledge_embeddings").delete().eq("client_id", clientId);

    // ── Embed each item and save ─────────────────────────────────────────
    for (const item of items) {
      try {
        const embedding = await generateEmbedding(item.content);

        await supabase.from("knowledge_embeddings").insert({
          client_id:   clientId,
          source_id:   item.source_id,
          source_type: item.source_type,
          title:       item.title,
          content:     item.content,
          embedding,
        });

        embedded++;

        // Small delay to avoid HuggingFace rate limits
        await new Promise(r => setTimeout(r, 200));

      } catch (err) {
        errors.push(`Failed to embed: ${item.title}`);
        console.error(err);
      }
    }

    return NextResponse.json({
      success:  true,
      embedded,
      total:    items.length,
      errors,
    });

  } catch (err) {
    console.error("Embed error:", err);
    return NextResponse.json({ error: "Embedding failed" }, { status: 500 });
  }
}
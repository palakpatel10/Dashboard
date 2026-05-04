import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateEmbedding } from "@/lib/embeddings";
import { askGroq } from "@/lib/groq";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── POST /api/ai/ask ──────────────────────────────────────────────────────
// 1. Embed the question
// 2. Search Supabase pgvector for relevant knowledge
// 3. Send question + context to Groq Llama 3
// 4. Return answer + sources
export async function POST(req: NextRequest) {
  try {
    const { question, clientId } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 });
    }

    // ── Step 1: Embed the question ───────────────────────────────────────
    const queryEmbedding = await generateEmbedding(question);

    // ── Step 2: Search knowledge base via pgvector ───────────────────────
    const { data: matches, error: searchError } = await supabase.rpc(
      "search_knowledge",
      {
        query_embedding: queryEmbedding,
        match_client_id: clientId,
        match_count:     5,
      }
    );

    if (searchError) {
      console.error("Vector search error:", searchError);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    // ── Step 3: Ask Groq with context ────────────────────────────────────
    const context = (matches ?? []).filter((m: { similarity: number }) => m.similarity > 0.3);
    const answer  = await askGroq(question, context);

    // ── Step 4: Return answer + sources ──────────────────────────────────
    return NextResponse.json({
      answer,
      sources: context.map((c: {
        title: string;
        source_type: string;
        similarity: number;
        source_id: string;
      }) => ({
        title:      c.title,
        type:       c.source_type,
        similarity: Math.round(c.similarity * 100),
        sourceId:   c.source_id,
      })),
    });

  } catch (err) {
    console.error("AI ask error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
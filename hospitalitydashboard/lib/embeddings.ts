// ─────────────────────────────────────────────────────────────────────────────
// Free embeddings using HuggingFace all-MiniLM-L6-v2
// 384 dimensions, fast, free, perfect for semantic search
// ─────────────────────────────────────────────────────────────────────────────

const HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";

// ── Generate embedding for a single text ─────────────────────────────────
export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HuggingFace embedding error: ${err}`);
  }

  const data = await res.json();

  // HuggingFace returns nested array — flatten to 1D
  return Array.isArray(data[0]) ? data[0] : data;
}

// ── Generate embeddings for multiple texts ────────────────────────────────
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({ inputs: texts, options: { wait_for_model: true } }),
  });

  if (!res.ok) throw new Error(`HuggingFace error: ${await res.text()}`);
  return await res.json();
}

// ── Build text to embed from a knowledge item ─────────────────────────────
export function buildEmbeddingText(item: {
  title: string;
  content?: string;
  symptom?: string;
  solution?: string;
  category?: string;
  fix?: string;
}): string {
  // Combine all relevant fields into one searchable string
  return [
    item.title,
    item.category,
    item.content,
    item.symptom,
    item.solution,
    item.fix,
  ].filter(Boolean).join(". ");
}
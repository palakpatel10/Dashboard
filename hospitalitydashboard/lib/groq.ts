// ─────────────────────────────────────────────────────────────────────────────
// Free LLM using Groq + Llama 3
// 14,400 free requests/day — more than enough for single client
// ─────────────────────────────────────────────────────────────────────────────

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL        = "llama3-8b-8192"; // free, fast, capable

interface KnowledgeContext {
  title:       string;
  content:     string;
  source_type: string;
  similarity:  number;
}

// ── Ask Groq a question with knowledge base context ───────────────────────
export async function askGroq(
  question: string,
  context:  KnowledgeContext[]
): Promise<string> {

  // Build context string from retrieved knowledge items
  const contextText = context.length > 0
    ? context.map((c, i) =>
        `[${i + 1}] ${c.source_type.toUpperCase()}: ${c.title}\n${c.content}`
      ).join("\n\n")
    : "No specific knowledge items found for this query.";

  const systemPrompt = `You are a helpful AI assistant for a hospitality business. 
You answer questions based ONLY on the knowledge base context provided below.
If the answer is not in the context, say so clearly and suggest contacting the relevant department.
Be concise, practical and action-oriented. Format step-by-step instructions as numbered lists.

KNOWLEDGE BASE CONTEXT:
${contextText}`;

  const res = await fetch(GROQ_API_URL, {
    method:  "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      model:       MODEL,
      messages: [
        { role: "system",  content: systemPrompt },
        { role: "user",    content: question      },
      ],
      temperature:  0.3,   // lower = more factual, less creative
      max_tokens:   1024,
      stream:       false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error: ${err}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content ?? "I could not generate a response.";
}

// ── Streaming version (for real-time typing effect) ───────────────────────
export async function askGroqStream(
  question: string,
  context:  KnowledgeContext[],
  onChunk:  (chunk: string) => void
): Promise<void> {
  const contextText = context.map((c, i) =>
    `[${i + 1}] ${c.source_type.toUpperCase()}: ${c.title}\n${c.content}`
  ).join("\n\n");

  const res = await fetch(GROQ_API_URL, {
    method:  "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      model:       MODEL,
      messages: [
        { role: "system", content: `You are a helpful hospitality business assistant. Answer based on this context:\n\n${contextText}` },
        { role: "user",   content: question },
      ],
      temperature: 0.3,
      max_tokens:  1024,
      stream:      true,
    }),
  });

  if (!res.ok) throw new Error(`Groq stream error: ${await res.text()}`);

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n").filter(l => l.startsWith("data: "));
    for (const line of lines) {
      const json = line.replace("data: ", "");
      if (json === "[DONE]") return;
      try {
        const chunk = JSON.parse(json);
        const text  = chunk.choices[0]?.delta?.content ?? "";
        if (text) onChunk(text);
      } catch { /* skip malformed chunks */ }
    }
  }
}
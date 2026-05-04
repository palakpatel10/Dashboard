"use client";
import { useState } from "react";
import { Card } from "./shared";
import { CLIENT_ID } from "../../../lib/supabase";

const SUGGESTED = [
  "air conditioning making noise",
  "card reader not working",
  "fire inspection overdue",
  "new employee checklist",
  "wifi not connecting",
  "hot water pressure low",
];

// ── Types ──────────────────────────────────────────────────────────────────
interface NormalResult {
  title: string;
  type: string;
  excerpt: string;
}

interface AISource {
  title: string;
  type: string;
  similarity: number;
}

interface AIResult {
  answer: string;
  sources: AISource[];
}

// ── Normal keyword search via /api/knowledge ───────────────────────────────
async function normalSearch(q: string): Promise<NormalResult[]> {
  const res = await fetch(`/api/knowledge?q=${encodeURIComponent(q)}&clientId=${CLIENT_ID}`);
  const data = await res.json();
  return (data.results ?? []).map((r: {
    title: string;
    source: string;
    symptom?: string;
    solution?: string;
    fix?: string;
  }) => ({
    title:   r.title,
    type:    r.source,
    excerpt: r.symptom ?? r.solution ?? r.fix ?? "",
  }));
}

// ── AI RAG search via /api/ai/ask ──────────────────────────────────────────
async function aiSearch(q: string): Promise<AIResult> {
  const res = await fetch("/api/ai/ask", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ question: q, clientId: CLIENT_ID }),
  });
  return await res.json();
}

// ── Status badge ───────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    SOP:             "#7c6af7",
    Manual:          "#22d3ee",
    Troubleshooting: "#f97316",
    "Fault Library": "#f43f5e",
  };
  return (
    <span style={{
      background: "#1e293b", color: colors[type] ?? "#64748b",
      fontSize: 11, fontWeight: 700, padding: "2px 8px",
      borderRadius: 99, border: `1px solid ${colors[type] ?? "#334155"}`,
    }}>
      {type}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AskAIPage() {
  const [query, setQuery]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [normalResults, setNormal]    = useState<NormalResult[] | null>(null);
  const [aiResult, setAI]             = useState<AIResult | null>(null);
  const [searched, setSearched]       = useState("");
  const [error, setError]             = useState("");

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setNormal(null);
    setAI(null);
    setSearched(q);
    setQuery(q);

    try {
      // Run both searches in parallel
      const [normal, ai] = await Promise.all([
        normalSearch(q),
        aiSearch(q),
      ]);
      setNormal(normal);
      setAI(ai);
    } catch (err) {
      setError("Search failed — check your API keys in .env.local");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div>
        <h2 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, margin: 0 }}>
          🔬 Search Comparison
        </h2>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
          See the difference between normal keyword search and AI semantic search
        </p>
      </div>

      {/* Search input */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch(query)}
            placeholder="Try: 'air conditioning making noise' or 'card wont work'..."
            style={{
              flex: 1, background: "#0f172a", border: "1px solid #334155",
              borderRadius: 10, padding: "12px 16px", color: "#f1f5f9", fontSize: 14,
            }}
          />
          <button
            onClick={() => handleSearch(query)}
            disabled={loading}
            style={{
              background: loading ? "#4c3d9e" : "#7c6af7", color: "#fff",
              border: "none", borderRadius: 10, padding: "12px 24px",
              cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14,
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Suggested queries */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <span style={{ color: "#475569", fontSize: 12, alignSelf: "center" }}>Try:</span>
          {SUGGESTED.map(q => (
            <button key={q} onClick={() => handleSearch(q)}
              style={{
                background: "#0f172a", border: "1px solid #334155",
                color: "#94a3b8", borderRadius: 20, padding: "4px 12px",
                cursor: "pointer", fontSize: 12,
              }}>
              {q}
            </button>
          ))}
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div style={{ background: "#431407", border: "1px solid #92400e", borderRadius: 10, padding: 16, color: "#fbbf24", fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results — side by side */}
      {(normalResults !== null || aiResult !== null) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Left — Normal search */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ background: "#1e293b", borderRadius: 8, padding: "6px 14px" }}>
                <span style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>
                  🔤 Normal Keyword Search
                </span>
              </div>
              <span style={{ color: "#475569", fontSize: 12 }}>
                exact word match only
              </span>
            </div>

            <Card style={{ minHeight: 300 }}>
              {loading && (
                <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>
                  Searching...
                </div>
              )}
              {!loading && normalResults?.length === 0 && (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>❌</div>
                  <div style={{ color: "#f97316", fontWeight: 700, marginBottom: 8 }}>
                    No results found
                  </div>
                  <div style={{ color: "#475569", fontSize: 13 }}>
                    "{searched}" didn't match any exact keywords
                  </div>
                </div>
              )}
              {!loading && (normalResults ?? []).map((r, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #334155" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <TypeBadge type={r.type} />
                    <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>{r.title}</span>
                  </div>
                  {r.excerpt && (
                    <div style={{ color: "#64748b", fontSize: 13, marginLeft: 4 }}>{r.excerpt}</div>
                  )}
                </div>
              ))}
            </Card>
          </div>

          {/* Right — AI search */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ background: "#1e1b4b", border: "1px solid #4c3d9e", borderRadius: 8, padding: "6px 14px" }}>
                <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700 }}>
                  ✨ AI Semantic Search
                </span>
              </div>
              <span style={{ color: "#475569", fontSize: 12 }}>
                understands meaning
              </span>
            </div>

            <Card style={{ minHeight: 300, border: "1px solid #4c3d9e" }}>
              {loading && (
                <div style={{ color: "#475569", textAlign: "center", padding: 40 }}>
                  AI is thinking...
                </div>
              )}

              {!loading && aiResult && (
                <div>
                  {/* AI Answer */}
                  <div style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.8, marginBottom: 16, whiteSpace: "pre-wrap" }}>
                    {aiResult.answer}
                  </div>

                  {/* Sources with similarity scores */}
                  {aiResult.sources?.length > 0 && (
                    <div style={{ borderTop: "1px solid #334155", paddingTop: 14 }}>
                      <div style={{ color: "#475569", fontSize: 11, fontWeight: 700, marginBottom: 10, textTransform: "uppercase" }}>
                        Sources Found
                      </div>
                      {aiResult.sources.map((s, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <TypeBadge type={s.type} />
                            <span style={{ color: "#94a3b8", fontSize: 13 }}>{s.title}</span>
                          </div>
                          {/* Similarity score bar */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 60, background: "#0f172a", borderRadius: 99, height: 4 }}>
                              <div style={{ width: `${s.similarity}%`, background: "#7c6af7", borderRadius: 99, height: 4 }} />
                            </div>
                            <span style={{ color: "#7c6af7", fontSize: 12, fontWeight: 700, width: 36 }}>
                              {s.similarity}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No sources found */}
                  {aiResult.sources?.length === 0 && (
                    <div style={{ color: "#475569", fontSize: 13, marginTop: 12 }}>
                      No matching knowledge items found — answer based on general knowledge only.
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && normalResults === null && aiResult === null && !error && (
        <Card style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔬</div>
          <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Test the difference
          </div>
          <div style={{ color: "#64748b", fontSize: 14, maxWidth: 400, margin: "0 auto" }}>
            Type a natural language query above and see how AI finds relevant knowledge even when exact keywords don't match
          </div>
        </Card>
      )}
    </div>
  );
}
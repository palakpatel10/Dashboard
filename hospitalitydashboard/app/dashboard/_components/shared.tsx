"use client";
import { useEffect, useState } from "react";

// ── Mobile detection hook ─────────────────────────────────────────────────
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ── Responsive grid ───────────────────────────────────────────────────────
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: number;       // desktop columns
  gap?: number;
}

export function ResponsiveGrid({ children, cols = 2, gap = 16 }: ResponsiveGridProps) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : `repeat(${cols}, 1fr)`,
      gap,
    }}>
      {children}
    </div>
  );
}

// ── Status colors ─────────────────────────────────────────────────────────
export const statusColor: Record<string, string> = {
  urgent:   "#f97316",
  upcoming: "#facc15",
  ok:       "#4ade80",
};

export const statusBg: Record<string, string> = {
  urgent:   "#431407",
  upcoming: "#422006",
  ok:       "#052e16",
};

// ── Card ──────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style = {} }: CardProps) {
  return (
    <div style={{
      background: "#1e293b", borderRadius: 12, padding: 20,
      border: "1px solid #334155", ...style,
    }}>
      {children}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────
interface BadgeProps { status: string; label: string; }

export function Badge({ status, label }: BadgeProps) {
  return (
    <span style={{
      background: statusBg[status] || "#1e293b",
      color: statusColor[status] || "#94a3b8",
      padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// ── AddButton ─────────────────────────────────────────────────────────────
interface AddButtonProps { label: string; onClick?: () => void; }

export function AddButton({ label, onClick }: AddButtonProps) {
  return (
    <button onClick={onClick} style={{
      background: "#7c6af7", color: "#fff", border: "none",
      borderRadius: 8, padding: "8px 18px", cursor: "pointer",
      fontWeight: 600, whiteSpace: "nowrap", fontSize: 14,
    }}>
      {label}
    </button>
  );
}

// ── SearchInput ───────────────────────────────────────────────────────────
interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", background: "#0f172a", border: "1px solid #334155",
        borderRadius: 8, padding: "10px 14px", color: "#f1f5f9",
        fontSize: 14, marginBottom: 16, boxSizing: "border-box",
      }}
    />
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "center",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? 10 : 0, marginBottom: 20,
    }}>
      <h2 style={{ color: "#f1f5f9", fontSize: isMobile ? 18 : 22, fontWeight: 700, margin: 0 }}>
        {title}
      </h2>
      {actionLabel && <AddButton label={actionLabel} onClick={onAction} />}
    </div>
  );
}

// ── Responsive table wrapper (scrollable on mobile) ───────────────────────
export function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      {children}
    </div>
  );
}
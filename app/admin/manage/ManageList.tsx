"use client";

import { useState } from "react";
import type { ArtworkCardData, Category, Status } from "@/types/artwork";
import { CATEGORIES } from "@/types/artwork";

type Row = ArtworkCardData;
type Draft = Partial<Pick<Row, "name" | "category" | "status">>;

const inputStyle: React.CSSProperties = {
  height: 40,
  width: "100%",
  background: "var(--inset)",
  border: "1px solid var(--line)",
  padding: "8px 12px",
  fontFamily: "var(--font-sf)",
  fontSize: 15,
  color: "var(--text)",
  outline: "none",
};

const ghostBtn: React.CSSProperties = {
  height: 36,
  padding: "0 14px",
  background: "transparent",
  border: "1px solid var(--line)",
  color: "var(--text)",
  cursor: "pointer",
  fontFamily: "var(--font-sf)",
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

export default function ManageList({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function draftValue<K extends keyof Draft>(row: Row, key: K): Row[K] {
    const d = drafts[row.id];
    return d && d[key] !== undefined ? (d[key] as Row[K]) : row[key];
  }

  function setDraft(id: number, patch: Draft) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
    setSavedId((s) => (s === id ? null : s));
  }

  function isDirty(row: Row): boolean {
    const d = drafts[row.id];
    if (!d) return false;
    return (
      (d.name !== undefined && d.name !== row.name) ||
      (d.category !== undefined && d.category !== row.category) ||
      (d.status !== undefined && d.status !== row.status)
    );
  }

  async function save(row: Row) {
    const d = drafts[row.id];
    if (!d) return;
    setSavingId(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/artworks/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to save");
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...d } : r)));
      setDrafts((ds) => {
        const rest = { ...ds };
        delete rest[row.id];
        return rest;
      });
      setSavedId(row.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSavingId(null);
    }
  }

  async function confirmDelete(id: number) {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/artworks/${id}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to delete");
      setRows((rs) => rs.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div
        style={{
          padding: "80px 0",
          textAlign: "center",
          color: "var(--text-dim)",
          fontSize: 16,
        }}
      >
        No pieces yet.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          style={{
            marginBottom: 20,
            fontSize: 14,
            color: "#ff6b6b",
            background: "rgba(255,107,107,0.08)",
            padding: "12px 14px",
          }}
        >
          {error}
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            minWidth: 760,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            background: "var(--line)",
          }}
        >
          {rows.map((row) => {
            const dirty = isDirty(row);
            const confirming = confirmId === row.id;
            return (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "56px 1fr 160px 140px auto",
                  gap: 16,
                  alignItems: "center",
                  background: "var(--card)",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                    background: row.image_url
                      ? `url('${row.image_url}') center/cover`
                      : "rgba(255,255,255,0.06)",
                  }}
                />
                <input
                  style={inputStyle}
                  value={draftValue(row, "name")}
                  onChange={(e) => setDraft(row.id, { name: e.target.value })}
                />
                <select
                  style={inputStyle}
                  value={draftValue(row, "category")}
                  onChange={(e) =>
                    setDraft(row.id, { category: e.target.value as Category })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  style={inputStyle}
                  value={draftValue(row, "status")}
                  onChange={(e) =>
                    setDraft(row.id, { status: e.target.value as Status })
                  }
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  {dirty && (
                    <button
                      onClick={() => save(row)}
                      disabled={savingId === row.id}
                      style={{
                        height: 36,
                        padding: "0 16px",
                        background: "var(--accent)",
                        color: "#0b0a0a",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 500,
                        fontSize: 13,
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {savingId === row.id ? "Saving…" : "Save"}
                    </button>
                  )}
                  {!dirty && savedId === row.id && (
                    <span style={{ fontSize: 13, color: "var(--accent)" }}>
                      Saved
                    </span>
                  )}
                  {confirming ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
                        Delete?
                      </span>
                      <button
                        onClick={() => confirmDelete(row.id)}
                        disabled={deletingId === row.id}
                        style={{
                          height: 36,
                          padding: "0 14px",
                          background: "#ff6b6b",
                          color: "#1c1e1f",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 500,
                          fontSize: 13,
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {deletingId === row.id ? "…" : "Yes"}
                      </button>
                      <button onClick={() => setConfirmId(null)} style={ghostBtn}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(row.id)} style={ghostBtn}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

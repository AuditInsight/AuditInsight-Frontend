"use client";

import { useEffect, useState } from "react";
import { PenLine, Clock } from "lucide-react";
import { getPendingSignatureRequests, SignatureRequestResponse } from "@/utils/api";
import { Evidence } from "@/types/evidence.types";

interface Props {
  /** The documents already loaded on the page, used to open a requested one in the signing view. */
  documents: Evidence[];
  onSign: (evidence: Evidence) => void;
  /** Change it (e.g. when the signing view closes) to fetch the list again. */
  refreshKey?: unknown;
}

/**
 * Documents someone in the organisation asked the logged-in user to sign and that they haven't signed or
 * declined yet. Hidden when there are none, so the page looks the same for everyone else.
 */
export default function PendingSignatureRequests({ documents, onSign, refreshKey }: Props) {
  const [requests, setRequests] = useState<SignatureRequestResponse[]>([]);

  useEffect(() => {
    let cancelled = false;
    getPendingSignatureRequests()
      .then(({ data }) => {
        if (!cancelled) setRequests(data.filter((r) => r.status === "PENDING"));
      })
      .catch(() => {
        // Not critical: the documents table below still lets them find and sign the document.
        if (!cancelled) setRequests([]);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (requests.length === 0) return null;

  return (
    <section style={card} aria-labelledby="pending-signatures-title">
      <div style={header}>
        <PenLine size={16} color="#1e3a8a" />
        <h2 id="pending-signatures-title" style={title}>
          Waiting for your signature
        </h2>
        <span style={count}>{requests.length}</span>
      </div>
      <ul style={list}>
        {requests.map((r) => {
          const doc = documents.find((d) => d.id === r.evidenceId);
          return (
            <li key={r.id} style={item}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={docName}>{r.documentName}</div>
                <div style={meta}>
                  Requested by <strong>{r.requestedByName}</strong>
                  <span style={dot}>·</span>
                  <Clock size={11} style={{ verticalAlign: "-1px" }} />{" "}
                  {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
                {r.message && <div style={note}>&ldquo;{r.message}&rdquo;</div>}
              </div>
              {doc ? (
                <button type="button" style={signBtn} onClick={() => onSign(doc)}>
                  <PenLine size={13} /> Sign
                </button>
              ) : (
                <span style={elsewhere}>In another organisation — switch to it to sign</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #bfdbfe",
  borderRadius: 16,
  overflow: "hidden",
};
const header: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 18px",
  background: "#eff6ff",
  borderBottom: "1px solid #dbeafe",
};
const title: React.CSSProperties = { margin: 0, fontSize: 14, fontWeight: 700, color: "#1e3a8a" };
const count: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  color: "#fff",
  background: "#1e3a8a",
  borderRadius: 999,
  padding: "1px 8px",
};
const list: React.CSSProperties = { listStyle: "none", margin: 0, padding: 0 };
const item: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  padding: "12px 18px",
  borderBottom: "1px solid #f1f5f9",
};
const docName: React.CSSProperties = { fontSize: 13.5, fontWeight: 600, color: "#0f172a", wordBreak: "break-word" };
const meta: React.CSSProperties = { fontSize: 12.5, color: "#64748b", marginTop: 2 };
const dot: React.CSSProperties = { margin: "0 6px" };
const note: React.CSSProperties = { fontSize: 12.5, color: "#475569", fontStyle: "italic", marginTop: 4 };
const signBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 14px",
  borderRadius: 8,
  border: "none",
  background: "linear-gradient(135deg,#0f3d75,#1e3a8a)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 12.5,
  fontWeight: 600,
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};
const elsewhere: React.CSSProperties = { fontSize: 12, color: "#94a3b8" };

"use client";

import { useRef, useState } from "react";
import {
  ShieldCheck, ChevronDown, ChevronRight, History, FileSearch, ListChecks, CheckCircle2, AlertTriangle, Loader2,
} from "lucide-react";
import {
  getEvidenceVersions, getEvidenceAuditTrail, verifyEvidenceCopy,
  type DocumentVersionsResponse, type AuditEventResponse, type AuditEventType, type VerificationResponse,
} from "@/utils/api";
import { signErrorMessage } from "./documentAccess";

interface Props {
  evidenceId: string;
}

const EVENT_LABELS: Record<AuditEventType, string> = {
  DOCUMENT_UPLOADED: "Uploaded",
  SIGNATURE_REQUESTED: "Signature requested",
  SIGNATURE_DECLINED: "Request declined",
  SIGNED: "Signed",
  VERSION_STORED: "Signed version stored",
  SIGNED_COPY_ACCESSED: "Signed copy opened",
  ORIGINAL_ACCESSED: "Original opened",
  VERIFICATION: "Copy verified",
};

// LocalDateTime values from the backend carry no zone and are UTC; audit events carry an explicit offset.
const fmt = (value: string) => {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  const d = new Date(hasZone ? value : `${value}Z`);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};
const short = (sha?: string | null) => (sha ? sha.slice(0, 12) : "—");
const kb = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`);

/**
 * "Integrity & activity" for one document: every stored version with its fingerprint, a check that tells whether
 * a copy someone holds is genuine (original, a signed version, or altered), and the full activity log.
 * Loads only when opened.
 */
export function DocumentIntegrityPanel({ evidenceId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<DocumentVersionsResponse | null>(null);
  const [events, setEvents] = useState<AuditEventResponse[] | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<(VerificationResponse & { fileName: string }) | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [v, a] = await Promise.all([getEvidenceVersions(evidenceId), getEvidenceAuditTrail(evidenceId)]);
      setVersions(v.data);
      setEvents(a.data);
    } catch (err) {
      setError(signErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) void load(); // refresh on every open so new signatures and accesses show up
  };

  const onVerifyFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setVerifying(true);
    setVerification(null);
    setError(null);
    try {
      const { data } = await verifyEvidenceCopy(evidenceId, file);
      setVerification({ ...data, fileName: file.name });
      void getEvidenceAuditTrail(evidenceId).then(({ data: a }) => setEvents(a)).catch(() => {});
    } catch (err) {
      setError(signErrorMessage(err));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={s.wrap}>
      <button type="button" style={s.header} onClick={toggle} aria-expanded={open}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <ShieldCheck size={15} color="#15803d" />
        <span style={s.headerText}>Integrity &amp; activity</span>
        <span style={s.headerHint}>versions, verify a copy, audit trail</span>
      </button>

      {open && (
        <div style={s.body}>
          {loading && <p style={s.muted}><Loader2 size={13} /> Loading…</p>}
          {error && <p style={s.error}>{error}</p>}

          {/* Versions */}
          {versions && (
            <section>
              <h4 style={s.h4}><History size={13} /> Versions</h4>
              <div style={s.table}>
                <div style={s.row}>
                  <span style={s.vTag}>v0</span>
                  <span style={s.cellMain}>Original upload</span>
                  <span style={s.mono} title={versions.original.sha256 ?? "Recorded the first time the original is opened"}>
                    {short(versions.original.sha256)}
                  </span>
                  <span style={s.cellMuted}>{versions.original.uploadedAt ? fmt(versions.original.uploadedAt) : ""}</span>
                </div>
                {versions.versions.map((v) => (
                  <div key={v.versionNo} style={s.row}>
                    <span style={s.vTag}>v{v.versionNo}</span>
                    <span style={s.cellMain}>
                      {v.signatureCount} {v.signatureCount === 1 ? "signature" : "signatures"} · {kb(v.sizeBytes)}
                    </span>
                    <span style={s.mono} title={v.sha256}>{short(v.sha256)}</span>
                    <span style={s.cellMuted}>{fmt(v.createdAt)}</span>
                  </div>
                ))}
              </div>
              <p style={s.hint}>
                The fingerprint is the start of the file&apos;s SHA-256. Any change to a file, however small, gives a
                different fingerprint.
              </p>
            </section>
          )}

          {/* Verify a copy */}
          <section>
            <h4 style={s.h4}><FileSearch size={13} /> Verify a copy</h4>
            <p style={s.hint}>
              Check a file you received or downloaded earlier. It is only fingerprinted, not stored.
            </p>
            <input ref={fileRef} type="file" onChange={onVerifyFile} style={{ display: "none" }} />
            <button type="button" style={s.verifyBtn} onClick={() => fileRef.current?.click()} disabled={verifying}>
              {verifying ? <><Loader2 size={13} /> Checking…</> : <><FileSearch size={13} /> Choose a file to verify</>}
            </button>
            {verification && (
              <div style={verification.result === "NO_MATCH" ? s.resultBad : s.resultGood}>
                {verification.result === "NO_MATCH"
                  ? <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  : <CheckCircle2 size={15} style={{ flexShrink: 0 }} />}
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {verification.result === "NO_MATCH" ? "Not a genuine copy" : "Genuine copy"} — {verification.fileName}
                  </div>
                  <div>{verification.message}</div>
                  {verification.signers.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      Signed by {verification.signers.map((sg) => `${sg.name} (${fmt(sg.signedAt)})`).join(", ")}
                    </div>
                  )}
                  <div style={s.monoSmall}>SHA-256 {verification.sha256}</div>
                </div>
              </div>
            )}
          </section>

          {/* Activity */}
          {events && (
            <section>
              <h4 style={s.h4}><ListChecks size={13} /> Activity</h4>
              {events.length === 0 ? (
                <p style={s.muted}>No activity recorded yet.</p>
              ) : (
                <ol style={s.timeline}>
                  {events.map((e) => (
                    <li key={e.id} style={s.event}>
                      <div style={s.eventTop}>
                        <strong>{EVENT_LABELS[e.eventType] ?? e.eventType}</strong>
                        {e.versionNo != null && <span style={s.vTag}>v{e.versionNo}</span>}
                        <span style={s.cellMuted}>{fmt(e.createdAt)}</span>
                      </div>
                      <div style={s.eventDetail}>
                        {e.actorName ?? "System"}{e.details ? ` — ${e.details}` : ""}
                      </div>
                      {(e.ipAddress || e.sha256) && (
                        <div style={s.monoSmall} title={e.userAgent ?? undefined}>
                          {e.ipAddress ? `IP ${e.ipAddress}` : ""}
                          {e.ipAddress && e.sha256 ? " · " : ""}
                          {e.sha256 ? `file ${short(e.sha256)}` : ""}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff" },
  header: { width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", border: "none", background: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", color: "#0f172a" },
  headerText: { fontSize: 13, fontWeight: 700 },
  headerHint: { fontSize: 11.5, color: "#94a3b8", marginLeft: "auto" },
  body: { padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 14 },
  h4: { display: "flex", alignItems: "center", gap: 6, margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.04em" },
  table: { display: "flex", flexDirection: "column", gap: 4 },
  row: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, padding: "6px 8px", borderRadius: 8, background: "#f8fafc", flexWrap: "wrap" },
  vTag: { fontSize: 10.5, fontWeight: 700, color: "#1e3a8a", background: "#e0e7ff", borderRadius: 999, padding: "1px 7px" },
  cellMain: { flex: "1 1 140px", color: "#0f172a" },
  cellMuted: { fontSize: 11.5, color: "#64748b" },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, color: "#334155" },
  monoSmall: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 10.5, color: "#64748b", marginTop: 3, wordBreak: "break-all" },
  hint: { margin: "4px 0 0", fontSize: 11.5, color: "#64748b", lineHeight: 1.45 },
  muted: { display: "flex", alignItems: "center", gap: 6, margin: 0, fontSize: 12.5, color: "#94a3b8" },
  error: { margin: 0, fontSize: 12.5, color: "#b91c1c" },
  verifyBtn: { display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, padding: "7px 12px", borderRadius: 8, border: "1px solid #c7d2fe", background: "#eef2ff", color: "#1e3a8a", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  resultGood: { display: "flex", gap: 8, marginTop: 10, padding: "10px 12px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", fontSize: 12.5, lineHeight: 1.45 },
  resultBad: { display: "flex", gap: 8, marginTop: 10, padding: "10px 12px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", fontSize: 12.5, lineHeight: 1.45 },
  timeline: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflowY: "auto" },
  event: { padding: "6px 8px", borderLeft: "2px solid #c7d2fe", background: "#fafafa", borderRadius: "0 8px 8px 0" },
  eventTop: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#0f172a", flexWrap: "wrap" },
  eventDetail: { fontSize: 12, color: "#475569", marginTop: 2 },
};

export default DocumentIntegrityPanel;

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PenLine, Send, UserPlus, X, Check, Eraser, Clock } from "lucide-react";
import { theme } from "@/styles/theme";
import { useAuth } from "@/context/AuthContext.production";
import { normalizeOrganisationId } from "@/utils/organisationId";
import {
  declineSignatureRequest,
  getEvidenceSignatures,
  getOrganisationMembers,
  requestEvidenceSignatures,
  signEvidence,
  EvidenceSignaturesResponse,
  OrganisationMemberResponse,
} from "@/utils/api";

interface Props {
  evidenceId: string;
  /** Called after a signature is added so the parent can refresh badges/counts. */
  onChanged?: () => void;
}

// The backend sends LocalDateTime without a zone (server time is UTC) — treat it as UTC.
function formatSignedAt(value: string): string {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  const d = new Date(hasZone ? value : `${value}Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function errorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { error?: string; message?: string } } };
  return e?.response?.data?.error ?? e?.response?.data?.message ?? fallback;
}

export function EvidenceSignaturesSection({ evidenceId, onChanged }: Props) {
  const { user } = useAuth();
  const [data, setData] = useState<EvidenceSignaturesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<"none" | "sign" | "request">("none");

  const load = useCallback(async () => {
    try {
      const { data } = await getEvidenceSignatures(evidenceId);
      setData(data);
      setError(null);
    } catch (err) {
      setError(errorMessage(err, "Could not load signatures."));
    } finally {
      setLoading(false);
    }
  }, [evidenceId]);

  useEffect(() => {
    setLoading(true);
    setPanel("none");
    load();
  }, [load]);

  const afterChange = async () => {
    setPanel("none");
    await load();
    onChanged?.();
  };

  const handleDecline = async () => {
    if (!data?.myPendingRequest) return;
    try {
      await declineSignatureRequest(data.myPendingRequest.id);
      await load();
    } catch (err) {
      setError(errorMessage(err, "Could not decline the request."));
    }
  };

  return (
    <div style={section}>
      <div style={sectionHeader}>
        <span style={sectionTitle}>Signatures</span>
        <span style={optionalTag}>Optional</span>
      </div>

      {loading && <p style={muted}>Loading signatures…</p>}
      {error && <p style={errorText}>{error}</p>}

      {data?.myPendingRequest && !data.signedByMe && (
        <div style={requestBanner}>
          <div style={{ flex: 1 }}>
            <strong>{data.myPendingRequest.requestedByName}</strong> asked you to sign this document.
            {data.myPendingRequest.message && (
              <div style={{ marginTop: 2, color: theme.colors.textMuted }}>“{data.myPendingRequest.message}”</div>
            )}
          </div>
          <button type="button" style={ghostBtn} onClick={handleDecline}>Decline</button>
        </div>
      )}

      {data && data.signatures.length === 0 && !loading && (
        <p style={muted}>Nobody has signed this document yet.</p>
      )}

      {data?.signatures.map((s) => (
        <div key={s.id} style={signatureRow}>
          <div style={avatar}>{s.signerName.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={signerName}>{s.signerName}</div>
            <div style={signedAtStyle}>
              Signed {formatSignedAt(s.signedAt)}
              <span style={s.requested ? tagRequested : tagVoluntary}>
                {s.requested ? "On request" : "Signed on their own"}
              </span>
            </div>
            {s.typedName && s.typedName !== s.signerName && (
              <div style={typedNameStyle}>{s.typedName}</div>
            )}
          </div>
          {s.signatureImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.signatureImage} alt={`Signature of ${s.signerName}`} style={signatureImg} />
          )}
        </div>
      ))}

      {data && data.pendingRequests.length > 0 && (
        <div style={{ marginTop: 6 }}>
          <div style={subLabel}>Waiting for</div>
          {data.pendingRequests.map((r) => (
            <div key={r.id} style={pendingRow}>
              <Clock size={12} /> {r.requestedUserName}
            </div>
          ))}
        </div>
      )}

      {data && panel === "none" && (
        <div style={actions}>
          {data.signedByMe ? (
            <span style={signedNote}><Check size={13} /> You signed this document</span>
          ) : (
            <button type="button" style={primaryBtn} onClick={() => setPanel("sign")}>
              <PenLine size={13} /> Sign this document
            </button>
          )}
          <button type="button" style={outlineBtn} onClick={() => setPanel("request")}>
            <UserPlus size={13} /> Ask others to sign
          </button>
        </div>
      )}

      {data && panel === "sign" && (
        <SignPanel
          evidenceId={evidenceId}
          defaultName={user?.fullName ?? ""}
          onCancel={() => setPanel("none")}
          onSigned={afterChange}
        />
      )}

      {data && panel === "request" && (
        <RequestPanel
          evidenceId={evidenceId}
          organisationId={normalizeOrganisationId(user?.organisationId) ?? ""}
          myEmail={user?.email}
          data={data}
          onCancel={() => setPanel("none")}
          onSent={afterChange}
        />
      )}
    </div>
  );
}

// ── Sign panel ──────────────────────────────────────────────────────

function SignPanel({
  evidenceId,
  defaultName,
  onCancel,
  onSigned,
}: {
  evidenceId: string;
  defaultName: string;
  onCancel: () => void;
  onSigned: () => void;
}) {
  const [mode, setMode] = useState<"type" | "draw">("type");
  const [typedName, setTypedName] = useState("");
  const [hasInk, setHasInk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * c.width) / r.width, y: ((e.clientY - r.top) * c.height) / r.height };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    canvasRef.current!.setPointerCapture(e.pointerId);
    const { x, y } = pos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasInk(true);
  };

  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  };

  const canSubmit = !submitting && (mode === "type" || hasInk);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await signEvidence(evidenceId, {
        typedName: mode === "type" && typedName.trim() ? typedName.trim() : undefined,
        signatureImage: mode === "draw" ? canvasRef.current?.toDataURL("image/png") : undefined,
      });
      onSigned();
    } catch (err) {
      setError(errorMessage(err, "Could not sign the document."));
      setSubmitting(false);
    }
  };

  return (
    <div style={panelBox}>
      <div style={tabs}>
        <button type="button" style={mode === "type" ? tabActive : tab} onClick={() => setMode("type")}>Type</button>
        <button type="button" style={mode === "draw" ? tabActive : tab} onClick={() => setMode("draw")}>Draw</button>
      </div>

      {mode === "type" ? (
        <div>
          <input
            style={input}
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder={defaultName ? `Type your name (optional) — e.g. ${defaultName}` : "Type your name (optional)"}
            maxLength={255}
          />
          {typedName.trim() && <div style={typedPreview}>{typedName}</div>}
        </div>
      ) : (
        <div>
          <canvas
            ref={canvasRef}
            width={520}
            height={160}
            style={canvasStyle}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
          <button type="button" style={ghostBtn} onClick={clear}><Eraser size={12} /> Clear</button>
        </div>
      )}

      <p style={hint}>Signing records your account name and the current time.</p>
      {error && <p style={errorText}>{error}</p>}

      <div style={actions}>
        <button type="button" style={outlineBtn} onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="button" style={{ ...primaryBtn, opacity: canSubmit ? 1 : 0.5 }} onClick={submit} disabled={!canSubmit}>
          <PenLine size={13} /> {submitting ? "Signing…" : "Sign"}
        </button>
      </div>
    </div>
  );
}

const NO_MEMBERS: OrganisationMemberResponse[] = [];

// ── Request panel ───────────────────────────────────────────────────

function RequestPanel({
  evidenceId,
  organisationId,
  myEmail,
  data,
  onCancel,
  onSent,
}: {
  evidenceId: string;
  organisationId: string;
  myEmail?: string;
  data: EvidenceSignaturesResponse;
  onCancel: () => void;
  onSent: () => void;
}) {
  const [fetchedMembers, setMembers] = useState<OrganisationMemberResponse[] | null>(null);
  const members = organisationId ? fetchedMembers : NO_MEMBERS;
  const [selected, setSelected] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEmail = () => {
    const value = emailInput.trim().toLowerCase();
    if (!value) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    if (value === myEmail?.toLowerCase()) {
      setError("You cannot request your own signature — just sign the document.");
      return;
    }
    setError(null);
    setEmails((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setEmailInput("");
  };

  useEffect(() => {
    if (!organisationId) return;
    getOrganisationMembers(organisationId)
      .then(({ data }) => setMembers(data ?? []))
      .catch((err) => {
        setMembers([]);
        setError(errorMessage(err, "Could not load organisation members."));
      });
  }, [organisationId]);

  const candidates = useMemo(() => {
    const taken = new Set<number>([
      ...data.signatures.map((s) => s.signerId),
      ...data.pendingRequests.map((r) => r.requestedUserId),
    ]);
    return (members ?? []).filter(
      (m) => m.status === "ACTIVE" && !taken.has(m.userId) && m.emailAddress?.toLowerCase() !== myEmail?.toLowerCase()
    );
  }, [members, data, myEmail]);

  const toggle = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await requestEvidenceSignatures(evidenceId, {
        userIds: selected,
        emails,
        message: message.trim() || undefined,
      });
      onSent();
    } catch (err) {
      setError(errorMessage(err, "Could not send the request."));
      setSubmitting(false);
    }
  };

  return (
    <div style={panelBox}>
      <p style={hint}>
        Asking is optional — people can sign this document without being asked.
      </p>

      {members === null && <p style={muted}>Loading members…</p>}
      {members !== null && candidates.length === 0 && (
        <p style={muted}>No other members to ask (everyone has signed or has already been asked).</p>
      )}

      {candidates.map((m) => (
        <label key={m.userId} style={memberRow}>
          <input type="checkbox" checked={selected.includes(m.userId)} onChange={() => toggle(m.userId)} />
          <span>{m.firstName} {m.lastName}</span>
          <span style={memberRole}>{m.role}</span>
        </label>
      ))}

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="email"
            style={{ ...input, flex: 1 }}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addEmail();
              }
            }}
            placeholder="Or ask someone by email (must be in your organisation)"
          />
          <button type="button" style={outlineBtn} onClick={addEmail}>
            Add
          </button>
        </div>
        {emails.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {emails.map((e) => (
              <span key={e} style={emailChip}>
                {e}
                <button
                  type="button"
                  style={emailChipRemove}
                  aria-label={`Remove ${e}`}
                  onClick={() => setEmails((prev) => prev.filter((x) => x !== e))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {(candidates.length > 0 || emails.length > 0) && (
        <textarea
          style={{ ...input, marginTop: 8, minHeight: 56, resize: "vertical" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message (optional)"
          maxLength={1000}
        />
      )}

      {error && <p style={errorText}>{error}</p>}

      <div style={actions}>
        <button type="button" style={outlineBtn} onClick={onCancel} disabled={submitting}>
          <X size={13} /> Cancel
        </button>
        <button
          type="button"
          style={{ ...primaryBtn, opacity: selected.length + emails.length > 0 && !submitting ? 1 : 0.5 }}
          onClick={submit}
          disabled={selected.length + emails.length === 0 || submitting}
        >
          <Send size={13} /> {submitting ? "Sending…" : `Send request${selected.length + emails.length > 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────

const section: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  paddingTop: 14,
  borderTop: `1px solid ${theme.colors.border}`,
};
const sectionHeader: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8 };
const sectionTitle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: theme.colors.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
const optionalTag: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  padding: "1px 7px",
  borderRadius: 999,
  background: "#f1f5f9",
  color: "#64748b",
};
const muted: React.CSSProperties = { margin: 0, fontSize: 12.5, color: theme.colors.textMuted };
const errorText: React.CSSProperties = { margin: 0, fontSize: 12.5, color: "#b91c1c" };
const hint: React.CSSProperties = { margin: "8px 0 0", fontSize: 12, color: theme.colors.textMuted };
const subLabel: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: theme.colors.textMuted, marginBottom: 4 };

const signatureRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 10px",
  borderRadius: 10,
  background: "#f8fafc",
  border: `1px solid ${theme.colors.border}`,
};
const avatar: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: "#dbeafe",
  color: "#1e3a8a",
  fontWeight: 700,
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
const signerName: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: theme.colors.textPrimary };
const signedAtStyle: React.CSSProperties = {
  fontSize: 11.5,
  color: theme.colors.textMuted,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 6,
};
const tagBase: React.CSSProperties = { fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 999 };
const tagRequested: React.CSSProperties = { ...tagBase, background: "#fef3c7", color: "#92400e" };
const tagVoluntary: React.CSSProperties = { ...tagBase, background: "#dcfce7", color: "#166534" };
const typedNameStyle: React.CSSProperties = {
  marginTop: 2,
  fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
  fontSize: 18,
  color: "#0f172a",
};
const signatureImg: React.CSSProperties = { height: 36, maxWidth: 110, objectFit: "contain", background: "#fff", borderRadius: 4 };
const pendingRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12.5,
  color: theme.colors.textSecondary,
  padding: "2px 0",
};
const requestBanner: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 10,
  background: "#fffbeb",
  border: "1px solid #fde68a",
  fontSize: 12.5,
  color: "#78350f",
};
const actions: React.CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6, alignItems: "center" };
const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 8,
  fontSize: 12.5,
  fontWeight: 600,
  cursor: "pointer",
};
const primaryBtn: React.CSSProperties = { ...btnBase, background: "#1e3a8a", color: "#fff", border: "1px solid #1e3a8a" };
const outlineBtn: React.CSSProperties = { ...btnBase, background: "#fff", color: "#1e3a8a", border: "1px solid #bfdbfe" };
const ghostBtn: React.CSSProperties = { ...btnBase, background: "transparent", color: "#475569", border: "1px solid transparent", padding: "6px 10px" };
const signedNote: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#166534", fontWeight: 600 };
const panelBox: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: `1px solid ${theme.colors.border}`,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};
const tabs: React.CSSProperties = { display: "flex", gap: 6 };
const tab: React.CSSProperties = { ...btnBase, padding: "5px 12px", background: "#f1f5f9", color: "#475569", border: "1px solid transparent" };
const tabActive: React.CSSProperties = { ...tab, background: "#dbeafe", color: "#1e3a8a" };
const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 11px",
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
  fontSize: 13,
  fontFamily: "inherit",
};
const typedPreview: React.CSSProperties = {
  marginTop: 6,
  padding: "8px 10px",
  borderBottom: "2px solid #0f172a",
  fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
  fontSize: 26,
  color: "#0f172a",
};
const canvasStyle: React.CSSProperties = {
  width: "100%",
  height: 160,
  border: `1px dashed ${theme.colors.border}`,
  borderRadius: 8,
  background: "#fff",
  touchAction: "none",
  cursor: "crosshair",
};
const emailChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "3px 8px",
  borderRadius: 999,
  background: "#e0e7ff",
  color: "#1e3a8a",
  fontSize: 12,
};

const emailChipRemove: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
  padding: 0,
};

const memberRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  padding: "4px 0",
  cursor: "pointer",
};
const memberRole: React.CSSProperties = { fontSize: 11, color: theme.colors.textMuted, marginLeft: "auto" };

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Eye, PenLine, Plus, Trash2,
  FileSignature, AlertCircle, Loader2,
} from "lucide-react";
import { theme } from "@/styles/theme";
import { zIndex } from "@/styles/zIndex";
import { getSigningBase, signEvidence, type SignaturePlacement } from "@/utils/api";
import { SignaturePad, EMPTY_SIGNATURE, type SignaturePadValue } from "./SignaturePad";
import { openPdf } from "./pdfjs";
import { signErrorMessage } from "./documentAccess";

interface Props {
  evidence: { id: string; documentName: string };
  /** Pre-fills the "Full names" field. */
  defaultFullName?: string;
  onClose: () => void;
  /** Called once the signature is saved; the server then stores the new signed version. */
  onSigned: () => void;
}

/** A signature box on one page, as fractions (0..1) of the displayed page from its top-left corner. */
type Box = SignaturePlacement & { id: string };

const MIN_W = 0.03;
const MIN_H = 0.015;
const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round6 = (v: number) => Math.round(v * 1e6) / 1e6;
const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

/**
 * Full-screen signing view: the real document rendered page by page, where the signer draws or types a signature,
 * drops it on any page, drags and resizes it, previews the result and confirms. Positions are kept as fractions
 * of the displayed page, so they are the same at every zoom level and screen size.
 */
export function SignaturePlacementModal({ evidence, defaultFullName, onClose, onSigned }: Props) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [baseSha, setBaseSha] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pageSize, setPageSize] = useState<{ w: number; h: number } | null>(null);
  const [viewerWidth, setViewerWidth] = useState(0);

  const [pad, setPad] = useState<SignaturePadValue>(EMPTY_SIGNATURE);
  const [imageRatio, setImageRatio] = useState<number | null>(null); // drawn signature height / width
  const [fullName, setFullName] = useState(defaultFullName ?? "");
  const [title, setTitle] = useState("");

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; mode: "move" | "resize"; startX: number; startY: number; orig: Box } | null>(null);

  const hasSignature = Boolean(pad.signatureImage || pad.typedName.trim());
  const pageCount = pdf?.numPages ?? 0;

  // ── Load the document the signature will be placed on ───────────────────────────
  useEffect(() => {
    let cancelled = false;
    let doc: PDFDocumentProxy | null = null;
    getSigningBase(evidence.id)
      .then(async ({ data, sha256 }) => {
        const opened = await openPdf(data);
        if (cancelled) {
          void opened.destroy();
          return;
        }
        doc = opened;
        setBaseSha(sha256);
        setPdf(opened);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Could not open the document for signing.");
      });
    return () => {
      cancelled = true;
      void doc?.destroy();
    };
  }, [evidence.id]);

  // ── Track the viewer width so "fit to width" follows window resizes ───────────────
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => setViewerWidth(entries[0].contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Render the current page ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!pdf || !canvas || viewerWidth <= 0) return;
    let cancelled = false;
    let task: RenderTask | null = null;
    pdf.getPage(pageIndex + 1).then((page) => {
      if (cancelled) return;
      // The page as displayed: crop box with the page's own rotation, like the server uses for placements.
      const natural = page.getViewport({ scale: 1 });
      const fit = Math.max(0.1, (viewerWidth - 48) / natural.width);
      const dpr = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: fit * zoom * dpr });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const css = { w: viewport.width / dpr, h: viewport.height / dpr };
      canvas.style.width = `${css.w}px`;
      canvas.style.height = `${css.h}px`;
      setPageSize(css);
      task = page.render({ canvas, viewport });
      task.promise.catch(() => { /* cancelled by a newer render */ });
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, pageIndex, zoom, viewerWidth]);

  // ── Natural shape of a drawn signature, so a new box matches it ───────────────────
  useEffect(() => {
    if (!pad.signatureImage) return;
    const img = new Image();
    img.onload = () => setImageRatio(img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : null);
    img.src = pad.signatureImage;
  }, [pad.signatureImage]);

  // ── Boxes ───────────────────────────────────────────────────────────────────────
  const addBox = () => {
    if (!hasSignature || !pageSize) return;
    const width = 0.28;
    const pixelAspect = pad.signatureImage && imageRatio ? imageRatio : 0.3;
    const height = clamp(width * pixelAspect * (pageSize.w / pageSize.h), MIN_H, 0.4);
    const box: Box = { id: newId(), pageIndex, x: (1 - width) / 2, y: (1 - height) / 2, width, height };
    setBoxes((all) => [...all, box]);
    setSelected(box.id);
    setPreviewing(false);
    setError(null);
  };

  const removeBox = (id: string) => {
    setBoxes((all) => all.filter((b) => b.id !== id));
    if (selected === id) setSelected(null);
  };

  const startDrag = (e: React.PointerEvent, box: Box, mode: "move" | "resize") => {
    if (previewing) return;
    e.preventDefault();
    e.stopPropagation();
    overlayRef.current?.setPointerCapture(e.pointerId);
    dragRef.current = { id: box.id, mode, startX: e.clientX, startY: e.clientY, orig: box };
    setSelected(box.id);
  };

  const onDrag = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || !pageSize) return;
    const fx = (e.clientX - d.startX) / pageSize.w;
    const fy = (e.clientY - d.startY) / pageSize.h;
    setBoxes((all) => all.map((b) => {
      if (b.id !== d.id) return b;
      if (d.mode === "move") {
        return { ...b, x: clamp(d.orig.x + fx, 0, 1 - b.width), y: clamp(d.orig.y + fy, 0, 1 - b.height) };
      }
      return {
        ...b,
        width: clamp(d.orig.width + fx, MIN_W, 1 - b.x),
        height: clamp(d.orig.height + fy, MIN_H, 1 - b.y),
      };
    }));
  };

  const endDrag = (e: React.PointerEvent) => {
    if (dragRef.current && overlayRef.current?.hasPointerCapture(e.pointerId)) {
      overlayRef.current.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
  };

  // Arrow keys nudge the selected box (Shift = bigger steps); Delete/Backspace removes it.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!selected || previewing) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      removeBox(selected);
      return;
    }
    const step = e.shiftKey ? 0.02 : 0.004;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    };
    const mv = moves[e.key];
    if (!mv) return;
    e.preventDefault();
    setBoxes((all) => all.map((b) => b.id !== selected ? b : {
      ...b, x: clamp(b.x + mv[0], 0, 1 - b.width), y: clamp(b.y + mv[1], 0, 1 - b.height),
    }));
  };

  const goToPage = (index: number) => {
    setPageIndex(clamp(index, 0, Math.max(0, pageCount - 1)));
    setSelected(null);
  };

  const zoomBy = (dir: 1 | -1) => {
    const i = ZOOM_STEPS.findIndex((z) => z >= zoom - 1e-6);
    const next = ZOOM_STEPS[clamp((i < 0 ? ZOOM_STEPS.length - 1 : i) + dir, 0, ZOOM_STEPS.length - 1)];
    setZoom(next);
  };

  // ── Confirm ─────────────────────────────────────────────────────────────────────
  const canConfirm = !submitting && hasSignature && fullName.trim().length > 0 && boxes.length > 0;

  const confirm = async () => {
    if (!canConfirm) {
      setError(
        !hasSignature ? "Draw or type your signature first."
          : !fullName.trim() ? "Enter your full names."
          : "Add your signature to the document, then drag it where it should go."
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signEvidence(evidence.id, {
        fullName: fullName.trim(),
        title: title.trim() || undefined,
        typedName: pad.signatureImage ? undefined : pad.typedName.trim() || undefined,
        signatureImage: pad.signatureImage ?? undefined,
        placements: boxes.map(({ pageIndex: p, x, y, width, height }) => ({
          pageIndex: p, x: round6(x), y: round6(y), width: round6(width), height: round6(height),
        })),
        baseSha256: baseSha ?? undefined,
      });
      onSigned();
    } catch (err) {
      setError(`Your signature wasn't saved: ${signErrorMessage(err)}`);
      setSubmitting(false);
    }
  };

  const pageBoxes = boxes.filter((b) => b.pageIndex === pageIndex);
  const captionPreview = `${fullName.trim() || "Your name"} · ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div style={s.overlay} role="dialog" aria-modal="true" aria-label={`Sign ${evidence.documentName}`}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerTitle}>
          <FileSignature size={17} color="#1e3a8a" />
          <div style={{ minWidth: 0 }}>
            <div style={s.title}>Sign “{evidence.documentName}”</div>
            <div style={s.subtitle}>Choose where your signature goes, then confirm.</div>
          </div>
        </div>

        <div style={s.toolbar}>
          <button type="button" style={s.iconBtn} onClick={() => goToPage(pageIndex - 1)}
            disabled={pageIndex === 0} aria-label="Previous page"><ChevronLeft size={16} /></button>
          <select style={s.pageSelect} value={pageIndex} onChange={(e) => goToPage(Number(e.target.value))}
            disabled={!pageCount} aria-label="Page">
            {Array.from({ length: pageCount }, (_, i) => (
              <option key={i} value={i}>
                Page {i + 1} of {pageCount}{boxes.some((b) => b.pageIndex === i) ? " ✓" : ""}
              </option>
            ))}
          </select>
          <button type="button" style={s.iconBtn} onClick={() => goToPage(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1} aria-label="Next page"><ChevronRight size={16} /></button>

          <span style={s.divider} />
          <button type="button" style={s.iconBtn} onClick={() => zoomBy(-1)} disabled={zoom <= ZOOM_STEPS[0]}
            aria-label="Zoom out"><ZoomOut size={15} /></button>
          <span style={s.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button type="button" style={s.iconBtn} onClick={() => zoomBy(1)}
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]} aria-label="Zoom in"><ZoomIn size={15} /></button>
          <button type="button" style={s.iconBtn} onClick={() => setZoom(1)} aria-label="Fit to width"
            title="Fit to width"><Maximize2 size={14} /></button>
        </div>

        <button type="button" style={s.closeBtn} onClick={onClose} disabled={submitting} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div style={s.body}>
        {/* Side panel */}
        <aside style={s.aside}>
          <div style={s.step}>
            <span style={s.stepNo}>1</span> Your details
          </div>
          <label style={s.label} htmlFor="place-full-name">Full names <span style={{ color: "#b91c1c" }}>*</span></label>
          <input id="place-full-name" style={s.input} value={fullName} maxLength={255}
            onChange={(e) => setFullName(e.target.value)} placeholder="As they should appear on the document" />
          <label style={s.label} htmlFor="place-title">Title <span style={{ fontWeight: 400 }}>(optional)</span></label>
          <input id="place-title" style={s.input} value={title} maxLength={255}
            onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Finance Manager" />

          <div style={s.step}><span style={s.stepNo}>2</span> Your signature</div>
          <SignaturePad value={pad} onChange={(v) => { setPad(v); setError(null); }} disabled={submitting} height={120} />

          <div style={s.step}><span style={s.stepNo}>3</span> Place it on the document</div>
          <button type="button" style={{ ...s.addBtn, opacity: hasSignature && pageSize ? 1 : 0.55 }}
            onClick={addBox} disabled={!hasSignature || !pageSize || submitting}>
            <Plus size={14} /> Add signature to page {pageIndex + 1}
          </button>
          <p style={s.hint}>
            Drag the box to move it and the corner handle to resize it. Arrow keys nudge the selected box;
            Delete removes it. You can place it on more than one page.
          </p>

          {boxes.length > 0 && (
            <div style={s.boxList}>
              {boxes.map((b, i) => (
                <div key={b.id} style={{ ...s.boxRow, ...(b.id === selected ? s.boxRowActive : {}) }}>
                  <button type="button" style={s.boxGo} onClick={() => { goToPage(b.pageIndex); setSelected(b.id); }}>
                    <PenLine size={12} /> Signature {i + 1} — page {b.pageIndex + 1}
                  </button>
                  <button type="button" style={s.boxRemove} onClick={() => removeBox(b.id)}
                    aria-label={`Remove signature ${i + 1}`}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Document */}
        <div ref={viewerRef} style={s.viewer}>
          {loadError ? (
            <div style={s.centerMsg}><AlertCircle size={18} color="#b91c1c" /> {loadError}</div>
          ) : !pdf ? (
            <div style={s.centerMsg}><Loader2 size={18} className="animate-spin" /> Opening the document…</div>
          ) : null}
          <div style={{ ...s.pageWrap, display: pdf && !loadError ? "block" : "none" }}>
            <canvas ref={canvasRef} style={s.canvas} />
            {pageSize && (
              <div
                ref={overlayRef}
                style={{ ...s.overlayLayer, width: pageSize.w, height: pageSize.h }}
                onPointerMove={onDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerDown={() => setSelected(null)}
                onKeyDown={onKeyDown}
                tabIndex={0}
                aria-label="Document page — signature positions"
              >
                {pageBoxes.map((b) => {
                  const w = b.width * pageSize.w;
                  const h = b.height * pageSize.h;
                  const isSel = b.id === selected && !previewing;
                  return (
                    <div
                      key={b.id}
                      style={{
                        ...s.box,
                        left: b.x * pageSize.w,
                        top: b.y * pageSize.h,
                        width: w,
                        height: h,
                        cursor: previewing ? "default" : "move",
                        border: previewing ? "1px solid transparent" : `1.5px ${isSel ? "solid" : "dashed"} #2563eb`,
                        background: previewing ? "transparent" : "rgba(37,99,235,0.06)",
                      }}
                      onPointerDown={(e) => startDrag(e, b, "move")}
                    >
                      {pad.signatureImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pad.signatureImage} alt="Your signature" draggable={false} style={s.sigImg} />
                      ) : (
                        <span style={{ ...s.sigTyped, fontSize: Math.max(8, Math.min(h * 0.7, (w * 0.95) / Math.max(1, pad.typedName.length * 0.45))) }}>
                          {pad.typedName}
                        </span>
                      )}
                      {previewing && <span style={s.caption}>{captionPreview}</span>}
                      {!previewing && (
                        <>
                          <button type="button" style={s.boxDelete} aria-label="Remove this signature"
                            onPointerDown={(e) => e.stopPropagation()} onClick={() => removeBox(b.id)}>
                            <X size={11} />
                          </button>
                          <span style={s.resizeHandle} onPointerDown={(e) => startDrag(e, b, "resize")}
                            aria-label="Resize signature" role="slider" aria-valuenow={Math.round(b.width * 100)} />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        {error && <div style={s.error}><AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}</div>}
        <div style={s.footerBtns}>
          <button type="button" style={s.cancelBtn} onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="button" style={{ ...s.previewBtn, ...(previewing ? s.previewBtnOn : {}) }}
            onClick={() => { setPreviewing((p) => !p); setSelected(null); }} disabled={boxes.length === 0}>
            <Eye size={14} /> {previewing ? "Back to editing" : "Preview"}
          </button>
          <button type="button" style={{ ...s.confirmBtn, opacity: canConfirm ? 1 : 0.6 }} onClick={confirm}
            disabled={submitting}>
            <FileSignature size={14} /> {submitting ? "Signing…" : "Confirm & sign"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, zIndex: zIndex.modal + 30, background: "#f1f5f9", display: "flex", flexDirection: "column", fontFamily: theme.typography.fontFamily },
  header: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#fff", borderBottom: `1px solid ${theme.colors.border}`, flexWrap: "wrap" },
  headerTitle: { display: "flex", alignItems: "center", gap: 10, flex: "1 1 220px", minWidth: 0 },
  title: { fontSize: 14.5, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  subtitle: { fontSize: 12, color: "#64748b" },
  toolbar: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  iconBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#334155", cursor: "pointer" },
  pageSelect: { height: 32, borderRadius: 8, border: "1px solid #e2e8f0", padding: "0 8px", fontSize: 13, fontFamily: "inherit", background: "#fff" },
  divider: { width: 1, height: 22, background: "#e2e8f0", margin: "0 4px" },
  zoomLabel: { minWidth: 44, textAlign: "center", fontSize: 12.5, color: "#334155", fontVariantNumeric: "tabular-nums" },
  closeBtn: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: "none", background: "#f1f5f9", color: "#475569", cursor: "pointer" },
  body: { flex: 1, minHeight: 0, display: "flex", flexWrap: "wrap", overflow: "auto" },
  aside: { flex: "1 1 280px", maxWidth: 340, background: "#fff", borderRight: `1px solid ${theme.colors.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", maxHeight: "100%", boxSizing: "border-box" },
  step: { display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 12.5, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.04em" },
  stepNo: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "#1e3a8a", color: "#fff", fontSize: 11 },
  label: { fontSize: 12, fontWeight: 600, color: "#374151" },
  input: { width: "100%", padding: "9px 11px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 13.5, fontFamily: "inherit", boxSizing: "border-box" },
  addBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 9, border: "none", background: "#1e3a8a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  hint: { margin: 0, fontSize: 11.5, color: "#64748b", lineHeight: 1.45 },
  boxList: { display: "flex", flexDirection: "column", gap: 6, marginTop: 4 },
  boxRow: { display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", borderRadius: 8, border: "1px solid #e2e8f0" },
  boxRowActive: { borderColor: "#2563eb", background: "#eff6ff" },
  boxGo: { flex: 1, display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", color: "#1e3a8a", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: "inherit", padding: "4px 2px" },
  boxRemove: { border: "none", background: "none", color: "#b91c1c", cursor: "pointer", padding: 4, display: "flex" },
  viewer: { flex: "3 1 420px", minWidth: 0, overflow: "auto", padding: 24, boxSizing: "border-box", position: "relative", maxHeight: "100%" },
  centerMsg: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: 48, fontSize: 13.5, color: "#475569" },
  pageWrap: { position: "relative", margin: "0 auto", width: "fit-content", boxShadow: "0 4px 18px rgba(15,23,42,0.12)", background: "#fff" },
  canvas: { display: "block" },
  overlayLayer: { position: "absolute", left: 0, top: 0, outline: "none", touchAction: "none" },
  box: { position: "absolute", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none", userSelect: "none" },
  sigImg: { width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" },
  sigTyped: { fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic", color: "#0f172a", whiteSpace: "nowrap", pointerEvents: "none", lineHeight: 1 },
  caption: { position: "absolute", left: 0, top: "100%", marginTop: 2, fontSize: 9, color: "#475569", whiteSpace: "nowrap", pointerEvents: "none" },
  boxDelete: { position: "absolute", top: -9, right: -9, width: 18, height: 18, borderRadius: "50%", border: "none", background: "#b91c1c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 },
  resizeHandle: { position: "absolute", right: -6, bottom: -6, width: 12, height: 12, borderRadius: 3, background: "#2563eb", border: "2px solid #fff", cursor: "nwse-resize" },
  footer: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "#fff", borderTop: `1px solid ${theme.colors.border}`, flexWrap: "wrap" },
  error: { flex: "1 1 260px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#b91c1c" },
  footerBtns: { display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" },
  cancelBtn: { padding: "9px 16px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13.5, cursor: "pointer", fontFamily: "inherit" },
  previewBtn: { display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9, border: "1px solid #c7d2fe", background: "#eef2ff", color: "#1e3a8a", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  previewBtnOn: { background: "#1e3a8a", color: "#fff", borderColor: "#1e3a8a" },
  confirmBtn: { display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#0f3d75,#1e3a8a)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
};

export default SignaturePlacementModal;

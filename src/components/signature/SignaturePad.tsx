"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PenLine, Type as TypeIcon, RotateCcw } from "lucide-react";

export interface SignaturePadValue {
  typedName: string;
  signatureImage: string | null; // PNG data URL — only set in "draw" mode
}

interface Props {
  value: SignaturePadValue;
  onChange: (value: SignaturePadValue) => void;
  disabled?: boolean;
  height?: number;
}

type Mode = "draw" | "type";

export const EMPTY_SIGNATURE: SignaturePadValue = { typedName: "", signatureImage: null };

export function SignaturePad({ value, onChange, disabled, height = 140 }: Props) {
  const [mode, setMode] = useState<Mode>("draw");
  const padRef = useRef<SignatureCanvas>(null);

  const handleEnd = () => {
    if (!padRef.current || padRef.current.isEmpty()) {
      onChange({ typedName: "", signatureImage: null });
      return;
    }
    const dataUrl = padRef.current.getTrimmedCanvas().toDataURL("image/png");
    onChange({ typedName: "", signatureImage: dataUrl });
  };

  const handleClear = () => {
    padRef.current?.clear();
    onChange({ typedName: "", signatureImage: null });
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    padRef.current?.clear();
    onChange({ typedName: "", signatureImage: null });
  };

  return (
    <div style={s.wrap}>
      <div style={s.tabs}>
        <button type="button" disabled={disabled} style={{ ...s.tab, ...(mode === "draw" ? s.tabActive : {}) }} onClick={() => switchMode("draw")}>
          <PenLine size={13} /> Draw
        </button>
        <button type="button" disabled={disabled} style={{ ...s.tab, ...(mode === "type" ? s.tabActive : {}) }} onClick={() => switchMode("type")}>
          <TypeIcon size={13} /> Type
        </button>
      </div>

      {mode === "draw" ? (
        <div>
          <div style={{ ...s.canvasBox, height }}>
            <SignatureCanvas
              ref={padRef}
              penColor="#0f172a"
              canvasProps={{ style: { width: "100%", height: "100%", cursor: disabled ? "not-allowed" : "crosshair" } }}
              onEnd={handleEnd}
              clearOnResize={false}
            />
          </div>
          <button type="button" style={s.clearBtn} onClick={handleClear} disabled={disabled}>
            <RotateCcw size={12} /> Clear
          </button>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Type your full name"
          value={value.typedName}
          disabled={disabled}
          onChange={(e) => onChange({ typedName: e.target.value, signatureImage: null })}
          style={s.typedInput}
        />
      )}
      <p style={s.hint}>
        Signing records your account name and the current time on the server — nobody else can sign as you.
      </p>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column", gap: 8 },
  tabs: { display: "flex", gap: 6 },
  tab: { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  tabActive: { background: "#0f3d75", borderColor: "#0f3d75", color: "#fff" },
  canvasBox: { border: "1.5px dashed #cbd5e1", borderRadius: 10, background: "#fff", overflow: "hidden" },
  clearBtn: { marginTop: 6, display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  typedInput: { width: "100%", padding: "14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 22, fontFamily: "'Brush Script MT', cursive", color: "#0f172a", outline: "none", boxSizing: "border-box", background: "#fff" },
  hint: { margin: 0, fontSize: 11, color: "#94a3b8" },
};

export default SignaturePad;

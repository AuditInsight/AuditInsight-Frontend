import { Colors } from "@/styles/colors";
import { spacing } from "@/styles/spacing";
import { radius } from "@/styles/radius";
import { shadows } from "@/styles/shadows";
import { theme } from "@/styles/theme";

import { zIndex } from "@/styles/zIndex";

export const modalStyles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: zIndex.modal,
  },

  /* =========================
     MODAL CONTAINER (UPGRADED)
  ========================= */

  container: {
    width: 640,
    maxWidth: "92%",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.94),
        rgba(255,255,255,0.88)
      )
    `,

    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",

    borderRadius: 28,

    border: "1px solid rgba(255,255,255,0.6)",

    boxShadow: shadows.xl,

    padding: 28,

    display: "flex",
    flexDirection: "column" as const,
    gap: 18,

    transition: "all 0.25s ease",
  },

  /* =========================
     HEADER
  ========================= */

  header: {
    fontSize: "18px",
    fontWeight: 600,

    color: Colors.textPrimary,

    marginBottom: spacing.md,
  },

  /* =========================
     CLOSE BUTTON
  ========================= */

  closeButton: {
    position: "absolute" as const,

    top: spacing.md,
    right: spacing.md,

    cursor: "pointer",

    fontSize: "18px",

    opacity: 0.7,

    transition: "0.2s ease",
  },

  closeButtonHover: {
    opacity: 1,
    transform: "scale(1.05)",
  },
};
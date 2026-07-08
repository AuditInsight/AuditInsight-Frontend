export const effects = {
  glass: {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },

  glassStrong: {
    backdropFilter: "blur(32px)",
    WebkitBackdropFilter: "blur(32px)",
  },

  noise: {
    backgroundImage:
      "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
    backgroundSize: "18px 18px",
  },

  /* =========================
     🧊 CONTENT SHELL (NEW)
  ========================= */

  contentShell: {
    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.72),
        rgba(255,255,255,0.58)
      )
    `,

    border: `
      1px solid rgba(255,255,255,0.55)
    `,

    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    borderRadius: "28px",

    padding: "24px",

    boxShadow: "0 12px 40px rgba(15, 23, 42, 0.12)",
  },
};



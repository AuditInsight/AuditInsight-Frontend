// layout/PageLayout.tsx

import Header from "@/components/layout/header/Header";
import { theme } from "@/styles/theme";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",

        // ✅ ADVANCED SAAS BACKGROUND
        background: `
          radial-gradient(
            circle at top left,
            rgba(15,94,255,0.10),
            transparent 30%
          ),

          radial-gradient(
            circle at bottom right,
            rgba(59,130,246,0.10),
            transparent 30%
          ),

          ${theme.colors.appBackground}
        `,

        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ⭐ GLOBAL HEADER */}
      <Header title="AuditInsight" />

      {/* ⭐ PAGE CONTENT AREA */}
      <main
        style={{
          padding: theme.spacing.xl,
          maxWidth: 1500,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}
      </main>
    </div>
  );
}
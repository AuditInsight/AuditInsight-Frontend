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
        background: theme.colors.appBackground,
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
        }}
      >
        {children}
      </main>
    </div>
  );
}

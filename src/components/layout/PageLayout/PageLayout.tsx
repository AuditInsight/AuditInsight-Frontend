import Header from "@/components/layout/header/Header";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header title="Audit Insight" />

      <main style={{ padding: "24px" }}>
        {children}
      </main>
    </div>
  );
}
import PageLayout from "@/components/layout/PageLayout/PageLayout";
import { AuthProvider } from "@/context/AuthContext";
import { Colors } from "@/styles/colors";
import { seedNotificationsIfEmpty } from "@/mock/notifications.mock";

if (typeof window !== "undefined") {
  seedNotificationsIfEmpty();
}

export const metadata = { title: "AuditInsight", description: "Enterprise audit & compliance platform" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        style={{
          backgroundColor: Colors.appBackground,
          margin: 0,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <AuthProvider>
          <PageLayout>{children}</PageLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

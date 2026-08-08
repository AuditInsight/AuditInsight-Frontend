import "./globals.css";
import { AuthProvider } from "@/context/AuthContext.production";
import SEO from "@/components/SEO";
import { Colors } from "@/styles/colors";

export const metadata = {
  title: "AuditInsight",
  description: "Enterprise audit & compliance platform",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    images: ["/logo.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        suppressHydrationWarning
        style={{
          backgroundColor: Colors.appBackground,
          margin: 0,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/*
          AuthProvider wraps the entire app.
          Each route group ((auth), (mse), (ngo), (admin)) owns its own
          layout shell — no global PageLayout wrapper needed here.
        */}
        <AuthProvider>
          <SEO title="AuditInsight" description="Enterprise audit & compliance platform" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}



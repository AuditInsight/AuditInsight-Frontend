import PageLayout from "../components/layout/PageLayout/PageLayout";
import { Colors } from "@/styles/colors";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: Colors.appBackground,
          margin: 0,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
/**
 * (auth)/layout.tsx
 * Auth pages (login, signup, forgot-password, etc.) render with no
 * header, sidebar, or shell — just a clean full-screen canvas.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}



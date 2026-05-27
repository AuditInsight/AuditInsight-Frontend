"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input/input";
import { Colors } from "@/styles/colors";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      alert("Please enter your email and password");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "No response body" };
      }

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={header}>
          <h2 style={headerTitle}>AuditInsight</h2>
        </div>

        <div style={body}>
          <h3 style={title}>Login</h3>
          <p style={subtitle}>Sign in to your audit workspace</p>

          <form
            style={form}
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            onKeyDown={handleKeyDown}
          >
            <Input
              variant="stacked"
              label="Email address"
              placeholder="you@company.com"
              value={email}
              onChange={setEmail}
              type="email"
            />

            <div style={{ marginTop: 20 }}>
              <Input
                variant="stacked"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                type="password"
              />
            </div>

            <div style={forgotRow}>
              <Link href="/forgot-password" style={forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...primaryBtn,
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Signing in…" : "Login"}
            </button>

            <a
              href="http://localhost:8080/oauth2/authorization/google"
              style={googleBtn}
            >
              Continue with Google
            </a>
          </form>

          <p style={footerText}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" style={footerLink}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: Colors.appBackground,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  borderRadius: 16,
  overflow: "hidden",
  background: Colors.Surface,
  boxShadow: "0 25px 70px rgba(0,0,0,0.12)",
  border: `1px solid ${Colors.border}`,
};

const header: React.CSSProperties = {
  background: Colors.gradientHeader,
  padding: "20px 24px",
  textAlign: "center",
};

const headerTitle: React.CSSProperties = {
  color: "#fff",
  fontSize: 20,
  fontWeight: 600,
  margin: 0,
};

const body: React.CSSProperties = {
  padding: "32px 28px 28px",
};

const title: React.CSSProperties = {
  textAlign: "center",
  margin: "0 0 6px",
  fontSize: 24,
  fontWeight: 700,
  color: Colors.textPrimary,
};

const subtitle: React.CSSProperties = {
  textAlign: "center",
  margin: "0 0 28px",
  fontSize: 14,
  color: Colors.textSecondary,
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

const forgotRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 10,
  marginBottom: 24,
};

const forgotLink: React.CSSProperties = {
  fontSize: 13,
  color: Colors.primary,
  textDecoration: "none",
  fontWeight: 500,
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 10,
  border: "none",
  background: Colors.primaryDark,
  color: "#fff",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  marginBottom: 12,
};

const googleBtn: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "13px 16px",
  borderRadius: 10,
  border: `1px solid ${Colors.borderStrong}`,
  background: Colors.Surface,
  color: Colors.textPrimary,
  fontWeight: 600,
  fontSize: 15,
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
  boxSizing: "border-box",
};

const footerText: React.CSSProperties = {
  textAlign: "center",
  marginTop: 24,
  marginBottom: 0,
  fontSize: 14,
  color: Colors.textSecondary,
};

const footerLink: React.CSSProperties = {
  color: Colors.primary,
  fontWeight: 600,
  textDecoration: "none",
};

"use client";

import { Colors } from "@/styles/colors";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: Colors.appBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "16px",
          overflow: "hidden",
          background: Colors.Surface,
          boxShadow: "0 25px 70px rgba(0,0,0,0.12)",
          border: `1px solid ${Colors.border}`,
        }}
      >
        <div
          style={{
            background: Colors.gradientHeader,
            padding: "22px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 600, margin: 0 }}>
            AuditInsight
          </h2>
        </div>

        <div style={{ padding: "34px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>

          <h3
            style={{
              marginBottom: "12px",
              fontSize: "22px",
              fontWeight: 600,
              color: Colors.textPrimary,
            }}
          >
            Password Reset
          </h3>

          <p style={{ fontSize: "14px", color: Colors.textSecondary, marginBottom: 24, lineHeight: 1.6 }}>
            Self-service password reset is not available. Please contact your administrator to have your
            password reset.
          </p>

          <p style={{ fontSize: "13px", color: Colors.textSecondary, marginBottom: 0 }}>
            If you are an invited member and were given a temporary password, you can{" "}
            <Link href="/log-in" style={{ color: Colors.primary, fontWeight: 500, textDecoration: "none" }}>
              log in
            </Link>{" "}
            and you will be prompted to set a new password.
          </p>

          <div style={{ marginTop: 28 }}>
            <Link
              href="/log-in"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                borderRadius: 8,
                background: Colors.primaryDark,
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

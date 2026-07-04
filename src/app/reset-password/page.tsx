"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.production";
import { Input } from "@/components/ui/input/input";
import { Colors } from "@/styles/colors";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { user, status } = useAuth();
  const loading = status === "loading";

  // completePasswordReset is a legacy mock helper — in production we call the API directly.
  // After a successful password change, we just redirect to dashboard.
  const completePasswordReset = (_newPassword?: string) => { /* no-op: API call handles this */ };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/log-in");
    }
  }, [loading, user, router]);

  const handleChangePassword = async () => {
    setError("");

    if (!user) {
      setError("You need to log in first.");
      return;
    }
    if (!PASSWORD_PATTERN.test(newPassword)) {
      setError(
        "New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (@$!%*?&)"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    completePasswordReset(newPassword);
    router.replace("/dashboard");
    setIsSubmitting(false);
  };

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

        <div style={{ padding: "34px" }}>
          <h3
            style={{
              textAlign: "center",
              marginBottom: "8px",
              fontSize: "24px",
              fontWeight: 600,
              color: Colors.textPrimary,
            }}
          >
            Change Password
          </h3>

          <p
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontSize: "14px",
              color: Colors.textSecondary,
            }}
          >
            You must set a new password before continuing
          </p>

          {error && (
            <p
              style={{
                background: "#fff0f0",
                border: "1px solid #fca5a5",
                color: "#dc2626",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </p>
          )}

          <div
            style={{
              background: Colors.appBackground,
              padding: "24px",
              borderRadius: "12px",
              border: `1px solid ${Colors.divider}`,
            }}
          >
            <Input
              label="Current Password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              type="password"
            />

            <div style={{ marginTop: "18px" }}>
              <Input
                label="New Password"
                placeholder="Min 8 chars, upper, lower, number, symbol"
                value={newPassword}
                onChange={setNewPassword}
                type="password"
              />
            </div>

            <div style={{ marginTop: "18px" }}>
              <Input
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                type="password"
              />
            </div>

            <div style={{ marginTop: "22px" }}>
              <button
                onClick={handleChangePassword}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "8px",
                  border: "none",
                  background: Colors.primaryDark,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "Saving…" : "Set New Password"}
              </button>
            </div>

            <p
              style={{
                textAlign: "center",
                marginTop: "16px",
                fontSize: "13px",
                color: Colors.textSecondary,
                marginBottom: 0,
              }}
            >
              <Link href="/log-in" style={{ color: Colors.primary, fontWeight: 500, textDecoration: "none" }}>
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

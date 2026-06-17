"use client";

import { useState, Suspense } from "react";
import { Input } from "@/components/ui/input/input";
import { Colors } from "@/styles/colors";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp, resendOtp } from "@/utils/api";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleVerify = async () => {
    setError("");
    if (!otp.trim()) {
      setError("Please enter the OTP code");
      return;
    }
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOtp(email, otp.trim());
      router.push("/log-in");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid or expired OTP. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccessMsg("");
    if (!email) {
      setError("Email not found. Please sign up again.");
      return;
    }

    setIsResending(true);
    try {
      await resendOtp(email);
      setSuccessMsg("A new OTP has been sent to your email.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      setError(msg);
    } finally {
      setIsResending(false);
    }
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
            Verify Your Email
          </h3>

          <p
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontSize: "14px",
              color: Colors.textSecondary,
            }}
          >
            Enter the 6-digit code sent to{" "}
            <strong style={{ color: Colors.textPrimary }}>{email || "your email"}</strong>
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

          {successMsg && (
            <p
              style={{
                background: "#f0fff4",
                border: "1px solid #86efac",
                color: "#16a34a",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {successMsg}
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
              label="OTP Code"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={setOtp}
            />

            <div style={{ marginTop: "22px" }}>
              <button
                onClick={handleVerify}
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
                {isSubmitting ? "Verifying…" : "Verify Code"}
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
              Didn&apos;t receive the code?{" "}
              <span
                onClick={isResending ? undefined : handleResend}
                style={{
                  color: Colors.primary,
                  cursor: isResending ? "not-allowed" : "pointer",
                  fontWeight: 500,
                  opacity: isResending ? 0.6 : 1,
                }}
              >
                {isResending ? "Sending…" : "Resend"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
}

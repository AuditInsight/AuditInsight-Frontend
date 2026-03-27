"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input/input";
import { Colors } from "@/styles/colors";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");

  return (
    <div
      style={{
        height: "100vh",
        background: Colors.appBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* MAIN CARD */}
      <div
        style={{
          width: "460px",
          borderRadius: "16px",
          overflow: "hidden",
          background: Colors.Surface,
          boxShadow: "0 25px 70px rgba(0,0,0,0.12)",
          border: `1px solid ${Colors.border}`,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: Colors.gradientHeader,
            padding: "22px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            AuditInsight
          </h2>
        </div>

        {/* BODY */}
        <div style={{ padding: "34px" }}>
          {/* TITLE */}
          <h3
            style={{
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "24px",
              fontWeight: 600,
              color: Colors.textPrimary,
            }}
          >
            Verify OTP
          </h3>

          {/* SUBTEXT */}
          <p
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontSize: "14px",
              color: Colors.textSecondary,
            }}
          >
            Enter the 6-digit code sent to your email
          </p>

          {/* FORM BOX */}
          <div
            style={{
              background: Colors.appBackground,
              padding: "24px",
              borderRadius: "12px",
              border: `1px solid ${Colors.divider}`,
            }}
          >
            {/* OTP INPUT */}
            <Input
              label="OTP Code"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={setOtp}
            />

            {/* VERIFY BUTTON */}
            <div style={{ marginTop: "22px" }}>
              <button
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "8px",
                  border: "none",
                  background: Colors.primaryDark,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    Colors.primaryDarker)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    Colors.primaryDark)
                }
              >
                Verify Code
              </button>
            </div>

            {/* RESEND */}
            <p
              style={{
                textAlign: "center",
                marginTop: "16px",
                fontSize: "13px",
                color: Colors.textSecondary,
              }}
            >
              Didn’t receive the code?{" "}
              <span
                style={{
                  color: Colors.primary,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Resend
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
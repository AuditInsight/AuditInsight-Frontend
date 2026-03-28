"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input/input";
import { Colors } from "@/styles/colors";
import Link from "next/dist/client/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            Reset Password
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
            Enter your new password below
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
            {/* NEW PASSWORD */}
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChange={setPassword}
              type="password"
            />

            {/* CONFIRM PASSWORD */}
            <div style={{ marginTop: "18px" }}>
              <Input
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                type="password"
              />
            </div>

            {/* BUTTON */}
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
                  (e.currentTarget.style.background = Colors.primaryDarker)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = Colors.primaryDark)
                }
              >
                Reset Password
              </button>
            </div>

            {/* BACK TO LOGIN */}
            <p
              style={{
                textAlign: "center",
                marginTop: "16px",
                fontSize: "13px",
                color: Colors.textSecondary,
              }}
            >
              Back to{" "}
              <Link href="/log-in" style={{ textDecoration: "none" }}>
                <span
                  style={{
                    color: Colors.primary,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Login
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

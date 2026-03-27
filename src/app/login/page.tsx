"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input/input";
import { Colors } from "@/styles/colors" // 👈 import your colors

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      style={{
        height: "100vh",
        background: Colors.appBackground, // ✅ from your system
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
          border: `1px solid ${Colors.border}`, // ✅ subtle polish
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: Colors.gradientHeader, // ✅ your gradient
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
              marginBottom: "24px",
              fontSize: "24px",
              fontWeight: 600,
              color: Colors.textPrimary,
            }}
          >
            Login
          </h3>

          {/* FORM BOX */}
          <div
            style={{
              background: Colors.appBackground, // softer than pure white
              padding: "24px",
              borderRadius: "12px",
              border: `1px solid ${Colors.divider}`,
            }}
          >
            {/* EMAIL */}
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              type="email"
            />

            {/* PASSWORD */}
            <div style={{ marginTop: "18px" }}>
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                type="password"
              />
            </div>

            {/* FORGOT */}
            <div
              style={{
                textAlign: "right",
                marginTop: "12px",
                fontSize: "13px",
                color: Colors.primary,
                cursor: "pointer",
              }}
            >
              Forgot password?
            </div>

            {/* BUTTON */}
            <div style={{ marginTop: "22px" }}>
              <button
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "8px",
                  border: "none",
                  background: Colors.primaryDark, // ✅ consistent branding
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
                Login
              </button>
            </div>
          </div>

          {/* SIGN UP */}
          <p
            style={{
              textAlign: "center",
              marginTop: "22px",
              fontSize: "14px",
              color: Colors.textSecondary,
            }}
          >
            Don’t have an account?{" "}
            <span
              style={{
                color: Colors.primary,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
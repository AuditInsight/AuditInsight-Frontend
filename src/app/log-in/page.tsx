"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input/input";
import { Colors } from "@/styles/colors";
import Link from "next/dist/client/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "No response body" };
      }

      console.log("Response data:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      router.replace("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

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

        <div style={{ padding: "34px" }}>
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

          <div
            style={{
              background: Colors.appBackground,
              padding: "24px",
              borderRadius: "12px",
              border: `1px solid ${Colors.divider}`,
            }}
          >
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              type="email"
            />

            <div style={{ marginTop: "18px" }}>
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                type="password"
              />
            </div>

            <Link href="/forgot-password">
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
            </Link>

            {/* LOGIN + GOOGLE */}
            <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                type="button"
                onClick={handleLogin}
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
                Login
              </button>

              <a
                href="http://localhost:8080/oauth2/authorization/google"
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "8px",
                  border: `1px solid ${Colors.border}`,
                  background: Colors.Surface,
                  color: Colors.textPrimary,
                  fontWeight: 600,
                  fontSize: "15px",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Continue with Google
              </a>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "22px",
              fontSize: "14px",
              color: Colors.textSecondary,
            }}
          >
            Don’t have an account?{" "}
            <Link href="/sign-up">
              <span
                style={{
                  color: Colors.primary,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Sign Up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
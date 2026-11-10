"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

/** "← Back to home" link shown above the login and sign-up forms, returning to the landing page. */
export default function BackToHome() {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href="/"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 24,
        padding: "6px 10px 6px 6px",
        borderRadius: 8,
        fontSize: 13.5,
        fontWeight: 600,
        color: hover ? "#1e3a8a" : "#475569",
        background: hover ? "rgba(30,58,138,0.06)" : "transparent",
        textDecoration: "none",
        transition: "all 0.15s",
      }}
    >
      <ArrowLeft size={15} strokeWidth={2.25} />
      Back to home
    </Link>
  );
}

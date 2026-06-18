"use client";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";
import { useRouter } from "next/navigation";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "CLIENT",  label: "Org Admin"      },
  { value: "MEMBER",  label: "Accountant"     },
  { value: "AUDITOR", label: "Auditor"      },
  { value: "ADMIN",   label: "Super Admin"  },
];

export default function RoleSwitcher() {
  const { role, setMockRole } = useAuth();
  const router = useRouter();

  const switchTo = (r: UserRole) => {
    setMockRole(r);
    router.replace(r === "ADMIN" ? "/admin/organizations" : "/dashboard");
  };

  return (
    <div style={container}>
      <span style={labelStyle}>🔧 Dev Role:</span>
      {ROLES.map((r) => (
        <button
          key={r.value}
          onClick={() => switchTo(r.value)}
          style={{
            ...btn,
            background: role === r.value ? "#1e3a8a" : "#f1f5f9",
            color:      role === r.value ? "#fff"    : "#374151",
            fontWeight: role === r.value ? 700       : 400,
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

const container: React.CSSProperties = {
  position: "fixed",
  bottom: 16,
  right: 16,
  zIndex: 9999,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
  fontSize: 13,
};

const labelStyle: React.CSSProperties = {
  color: "#6b7280",
  fontWeight: 600,
  marginRight: 4,
};

const btn: React.CSSProperties = {
  padding: "5px 12px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  cursor: "pointer",
  fontSize: 12,
  transition: "all 0.15s ease",
};

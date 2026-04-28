"use client";

export const TransactionsHeader = () => {
  return (
    <div style={container}>
      
      {/* 🔹 LEFT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        
        {/* LOGO */}
        <div style={logo}>AuditInsight</div>

        {/* NAV */}
        <div style={nav}>
          <NavItem label="Dashboard" />
          <NavItem label="Transactions" active />
          <NavItem label="Evidence" />
          <NavItem label="Review Queue" />
          <NavItem label="Reports" />
          <NavItem label="Settings" />
        </div>
      </div>

      {/* 🔹 RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, color: "#e2e8f0" }}>
          Welcome, Diana
        </span>

        <div style={avatar}>D</div>
      </div>
    </div>
  );
};

/* 🔹 NAV ITEM */
const NavItem = ({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) => {
  return (
    <div
      style={{
        ...navItem,
        borderBottom: active ? "2px solid #fff" : "none",
        opacity: active ? 1 : 0.8,
      }}
    >
      {label}
    </div>
  );
};

/* 🎨 STYLES */

const container: React.CSSProperties = {
  width: "100%",
  height: 60,
  background: "rgba(10, 65, 120, 0.92)",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  marginBottom: 20,
};

const logo: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 16,
};

const nav: React.CSSProperties = {
  display: "flex",
  gap: 16,
};

const navItem: React.CSSProperties = {
  fontSize: 14,
  cursor: "pointer",
  paddingBottom: 4,
};

const avatar: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: "#fff",
  color: "rgba(10, 65, 120, 0.92)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
};
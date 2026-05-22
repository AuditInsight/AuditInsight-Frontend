"use client";

import { useState } from "react";
import ToggleSwitch from "../shared/ToggleSwitch";

export default function SecuritySettingsCard() {
  const [twoFA, setTwoFA] = useState(true);
  const [ipRestriction, setIpRestriction] = useState(false);
  const [auditAlerts, setAuditAlerts] = useState(true);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Security Settings</h3>
        <p style={styles.subtitle}>
          Configure authentication and system security controls.
        </p>
      </div>

      <div style={styles.content}>
        {/* ITEM */}
        <div style={styles.item}>
          <div>
            <div style={styles.label}>Two-Factor Authentication</div>
            <div style={styles.description}>
              Protect accounts using MFA verification.
            </div>
          </div>

          <ToggleSwitch checked={twoFA} onChange={setTwoFA} />
        </div>

        {/* ITEM */}
        <div style={styles.item}>
          <div>
            <div style={styles.label}>IP Restrictions</div>
            <div style={styles.description}>
              Limit access to trusted IP ranges.
            </div>
          </div>

          <ToggleSwitch checked={ipRestriction} onChange={setIpRestriction} />
        </div>

        {/* ITEM */}
        <div style={styles.item}>
          <div>
            <div style={styles.label}>Audit Security Alerts</div>
            <div style={styles.description}>
              Notify admins of suspicious activity.
            </div>
          </div>

          <ToggleSwitch checked={auditAlerts} onChange={setAuditAlerts} />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    border: "1px solid #e5e7eb",
  },

  header: {
    marginBottom: 16,
  },

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #f3f4f6",
  },

  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
  },

  description: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 3,
  },
};
// Mock notification / email inbox — append-only in localStorage
export type NotifType =
  | "INVITE_SENT"
  | "FLAG_CREATED"
  | "FLAG_RESOLVED"
  | "PASSWORD_RESET"
  | "SUBSCRIPTION_SUSPENDED";

export interface MockNotification {
  id: string;
  type: NotifType;
  recipientEmail: string;
  subject: string;
  body: string;
  createdAt: string;
  read: boolean;
}

const NOTIF_KEY = "mock_notifications";

function read(): MockNotification[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? "[]"); } catch { return []; }
}

function write(items: MockNotification[]) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(items));
}

export function getNotifications(): MockNotification[] {
  return read();
}

export function getNotificationsForUser(email: string): MockNotification[] {
  return read().filter((n) => n.recipientEmail.toLowerCase() === email.toLowerCase());
}

export function sendNotification(n: Omit<MockNotification, "id" | "createdAt" | "read">) {
  const all = read();
  all.push({ ...n, id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString(), read: false });
  write(all);
}

export function markNotificationRead(id: string) {
  write(read().map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllRead(email: string) {
  write(read().map((n) => (n.recipientEmail.toLowerCase() === email.toLowerCase() ? { ...n, read: true } : n)));
}

// ── Seed realistic notifications if storage is empty ──
export function seedNotificationsIfEmpty() {
  if (read().length > 0) return;
  const seed: MockNotification[] = [
    {
      id: "notif-seed-001",
      type: "INVITE_SENT",
      recipientEmail: "accountant@insightai.rw",
      subject: "You've been invited to InsightAI Rwanda Ltd",
      body: "Louise Nzeyimana has invited you to join InsightAI Rwanda Ltd as an Accountant. Click the link in the original email to accept.",
      createdAt: "2024-02-01T07:00:00Z",
      read: true,
    },
    {
      id: "notif-seed-002",
      type: "INVITE_SENT",
      recipientEmail: "auditor@audit.rw",
      subject: "You've been invited to InsightAI Rwanda Ltd",
      body: "Louise Nzeyimana has invited you to join InsightAI Rwanda Ltd as an Auditor.",
      createdAt: "2024-03-10T07:00:00Z",
      read: true,
    },
    {
      id: "notif-seed-003",
      type: "FLAG_CREATED",
      recipientEmail: "accountant@insightai.rw",
      subject: "⚠ Auditor flagged TXN-0002 — Missing Evidence [Critical]",
      body: "Grace Uwimana has flagged transaction TXN-0002 (XYZ Corp – RWF 850,000). Issue: Missing Evidence. Severity: Critical. Please upload the supporting documents.",
      createdAt: "2024-06-03T10:05:00Z",
      read: false,
    },
    {
      id: "notif-seed-004",
      type: "FLAG_CREATED",
      recipientEmail: "accountant@insightai.rw",
      subject: "⚠ Auditor flagged TXN-0012 — Compliance Issue [Critical]",
      body: "Grace Uwimana has flagged transaction TXN-0012 (Suspicious Cash Withdrawal – RWF 980,000). Issue: AI/Risk Flag. Severity: Critical. Immediate explanation required.",
      createdAt: "2024-06-18T08:00:00Z",
      read: false,
    },
    {
      id: "notif-seed-005",
      type: "FLAG_RESOLVED",
      recipientEmail: "auditor@audit.rw",
      subject: "✅ Accountant resolved flag on TXN-0001",
      body: "Eric Bizimana has resolved the flag on TXN-0001 (Office Supplies – ABC Ltd). Resolution note: 'Bank confirmation and invoice uploaded.' Please review.",
      createdAt: "2024-06-03T11:30:00Z",
      read: false,
    },
    {
      id: "notif-seed-006",
      type: "FLAG_CREATED",
      recipientEmail: "accountant@insightai.rw",
      subject: "⚠ Auditor flagged TXN-0005 — Compliance Issue [Critical]",
      body: "Grace Uwimana flagged TXN-0005 (Cash Purchase – Local Shop). Issue: Cash posted at 23:47 on a Saturday. Violation of cash handling policy.",
      createdAt: "2024-06-08T11:05:00Z",
      read: true,
    },
    {
      id: "notif-seed-007",
      type: "FLAG_RESOLVED",
      recipientEmail: "auditor@audit.rw",
      subject: "✅ Accountant resolved flag on TXN-0003",
      body: "Eric Bizimana re-uploaded the signed June Payroll Register. Please review and verify the signature.",
      createdAt: "2024-06-06T08:30:00Z",
      read: true,
    },
  ];
  write(seed);
}

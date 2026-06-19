// Immutable audit trail — append-only, no delete/edit exposed
export type AuditAction =
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "PASSWORD_RESET"
  | "TRANSACTION_CREATE"
  | "TRANSACTION_UPDATE"
  | "TRANSACTION_DELETE"
  | "EVIDENCE_UPLOAD"
  | "EVIDENCE_DELETE"
  | "FLAG_CREATED"
  | "FLAG_RESOLVED"
  | "MEMBER_INVITED"
  | "MEMBER_SUSPENDED"
  | "MEMBER_ACTIVATED";

export interface AuditEntry {
  readonly id: string;
  readonly timestamp: string;
  readonly userId: number;
  readonly userEmail: string;
  readonly userRole: string;
  readonly action: AuditAction;
  readonly targetResourceId: string;
  readonly detail: string;
}

// In-memory append-only store (replace with API call in production)
const _log: AuditEntry[] = [
  { id: "al-001", timestamp: "2024-06-01T08:12:00Z", userId: 1, userEmail: "ceo@insightai.rw",        userRole: "CLIENT",  action: "USER_LOGIN",          targetResourceId: "user-1",   detail: "Admin logged in" },
  { id: "al-002", timestamp: "2024-06-01T09:00:00Z", userId: 2, userEmail: "accountant@insightai.rw", userRole: "MEMBER",  action: "TRANSACTION_CREATE",  targetResourceId: "TXN-0001", detail: "Created transaction RWF 450,000 — ABC Ltd" },
  { id: "al-003", timestamp: "2024-06-01T09:15:00Z", userId: 2, userEmail: "accountant@insightai.rw", userRole: "MEMBER",  action: "EVIDENCE_UPLOAD",     targetResourceId: "EVD-001",  detail: "Uploaded Invoice_June.pdf linked to TXN-0001" },
  { id: "al-004", timestamp: "2024-06-02T10:00:00Z", userId: 3, userEmail: "auditor@audit.rw",        userRole: "AUDITOR", action: "FLAG_CREATED",        targetResourceId: "TXN-0002", detail: "Flagged: Missing Evidence — Critical" },
  { id: "al-005", timestamp: "2024-06-03T11:30:00Z", userId: 2, userEmail: "accountant@insightai.rw", userRole: "MEMBER",  action: "FLAG_RESOLVED",       targetResourceId: "rq-001",   detail: "Resolved flag — uploaded bank confirmation" },
  { id: "al-006", timestamp: "2024-06-04T08:00:00Z", userId: 1, userEmail: "ceo@insightai.rw",        userRole: "CLIENT",  action: "MEMBER_INVITED",      targetResourceId: "user-5",   detail: "Invited patrick@insightai.rw as Accountant" },
  { id: "al-007", timestamp: "2024-06-05T14:00:00Z", userId: 2, userEmail: "accountant@insightai.rw", userRole: "MEMBER",  action: "TRANSACTION_UPDATE",  targetResourceId: "TXN-0003", detail: "Updated payroll amount from RWF 1,100,000 to RWF 1,200,000" },
  { id: "al-008", timestamp: "2024-06-06T09:00:00Z", userId: 1, userEmail: "ceo@insightai.rw",        userRole: "CLIENT",  action: "PASSWORD_RESET",      targetResourceId: "user-1",   detail: "Password changed by user" },
  { id: "al-009", timestamp: "2024-06-10T16:00:00Z", userId: 2, userEmail: "accountant@insightai.rw", userRole: "MEMBER",  action: "TRANSACTION_DELETE",  targetResourceId: "TXN-0009", detail: "Deleted duplicate transaction" },
  { id: "al-010", timestamp: "2024-06-12T10:00:00Z", userId: 3, userEmail: "auditor@audit.rw",        userRole: "AUDITOR", action: "FLAG_CREATED",        targetResourceId: "TXN-0012", detail: "Flagged: Compliance Issue — Critical — round number posted after midnight" },
];

export function getAuditLog(): readonly AuditEntry[] {
  return _log;
}

export function appendAuditLog(entry: Omit<AuditEntry, "id" | "timestamp">): void {
  const newEntry: AuditEntry = {
    ...entry,
    id: `al-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  // Append only — no edit, no delete
  (_log as AuditEntry[]).push(newEntry);
}

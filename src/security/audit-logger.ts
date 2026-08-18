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
const _log: AuditEntry[] = [];

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



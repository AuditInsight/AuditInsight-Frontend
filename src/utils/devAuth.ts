/**
 * devAuth.ts — Development-only login bypass.
 *
 * When NEXT_PUBLIC_DEV_AUTH=true, the login() function checks this table
 * BEFORE hitting the real API. If the email matches a dummy account the
 * function returns a fake LoginApiResponse (with a real-ish JWT structure)
 * so the AuthContext can decode it normally.
 *
 * This file is NEVER imported in production — the env flag gates it.
 */

import type { BackendRole } from "@/types/auth";
import type { OrgType } from "@/types/auth";

// ── Dummy credential table ────────────────────────────────────────────────────

interface DummyAccount {
  id: number;
  email: string;
  password: string;
  fullName: string;
  role: BackendRole;
  organisationId: string;
  organisationName: string;
  orgType: OrgType;
  /** Only set for DONOR_REPRESENTATIVE — restricts visible data */
  donorScope?: string;
  mustChangePassword: boolean;
}

export const DUMMY_ACCOUNTS: DummyAccount[] = [
  // ── Private company ──────────────────────────────────────────────
  {
    id: 1,
    email: "ceo@insightai.rw",
    password: "Password1",
    fullName: "Louise Nzeyimana",
    role: "CLIENT",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    orgType: "PRIVATE",
    mustChangePassword: false,
  },
  {
    id: 2,
    email: "accountant@insightai.rw",
    password: "Password1",
    fullName: "Eric Bizimana",
    role: "MEMBER",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    orgType: "PRIVATE",
    mustChangePassword: false,
  },
  {
    id: 3,
    email: "auditor@audit.rw",
    password: "Password1",
    fullName: "Grace Uwimana",
    role: "AUDITOR",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    orgType: "PRIVATE",
    mustChangePassword: false,
  },
  {
    id: 4,
    email: "admin@auditinsight.com",
    password: "Password1",
    fullName: "Super Admin",
    role: "ADMIN",
    organisationId: "",
    organisationName: "",
    orgType: "PRIVATE",
    mustChangePassword: false,
  },
  // ── NGO — Rwanda Health Foundation ──────────────────────────────
  {
    id: 10,
    email: "director@rwandahealth.org",
    password: "Password1",
    fullName: "Dr. Emmanuel Nkusi",
    role: "CLIENT",
    organisationId: "org-ngo-001",
    organisationName: "Rwanda Health Foundation",
    orgType: "NGO",
    mustChangePassword: false,
  },
  {
    id: 11,
    email: "finance@rwandahealth.org",
    password: "Password1",
    fullName: "Diane Uwase",
    role: "MEMBER",
    organisationId: "org-ngo-001",
    organisationName: "Rwanda Health Foundation",
    orgType: "NGO",
    mustChangePassword: false,
  },
  {
    id: 12,
    email: "auditor@rwandahealth.org",
    password: "Password1",
    fullName: "Grace Uwimana",
    role: "AUDITOR",
    organisationId: "org-ngo-001",
    organisationName: "Rwanda Health Foundation",
    orgType: "NGO",
    mustChangePassword: false,
  },
  {
    id: 13,
    email: "s.mitchell@usaid.gov",
    password: "Password1",
    fullName: "Sarah Mitchell",
    role: "MEMBER",
    organisationId: "org-ngo-001",
    organisationName: "Rwanda Health Foundation",
    orgType: "NGO",
    donorScope: "USAID",
    mustChangePassword: false,
  },
];

// ── Fake JWT builder ──────────────────────────────────────────────────────────
// Builds a base64url-encoded JWT with a real payload structure.
// The signature segment is fake — this is only for dev decoding, never verified.

function base64url(obj: object): string {
  const json = JSON.stringify(obj);
  if (typeof window !== "undefined") {
    return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
  return Buffer.from(json).toString("base64url");
}

function buildFakeJwt(account: DummyAccount): string {
  const header  = base64url({ alg: "HS256", typ: "JWT" });
  const now     = Math.floor(Date.now() / 1000);
  const payload = base64url({
    sub:            String(account.id),
    email:          account.email,
    fullName:       account.fullName,
    role:           account.role,
    organisationId: account.organisationId,
    orgType:        account.orgType,
    donorScope:     account.donorScope ?? null,
    iat:            now,
    exp:            now + 60 * 60 * 8,   // 8-hour session
  });
  const sig = base64url({ dev: true });   // fake signature — never verified
  return `${header}.${payload}.${sig}`;
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface DevLoginResult {
  status: string;
  message: string;
  token: string;
  role: BackendRole;
  orgType: OrgType;
  fullName: string;
  organisationName: string;
  donorScope?: string | null;
  mustChangePassword: boolean;
}

/**
 * Attempt a dev login. Returns null if the email is not in the dummy table
 * (meaning the caller should fall through to the real API).
 */
export function tryDevLogin(
  email: string,
  password: string
): DevLoginResult | null {
  const account = DUMMY_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  );

  if (!account) return null;   // not a dummy account — hit the real API

  if (account.password !== password) {
    // Throw the same shape as an Axios 401 so the login page handles it uniformly
    throw Object.assign(new Error("Invalid email or password."), {
      isAxiosError: true,
      response: { status: 401, data: { status: "error", message: "Invalid email or password." } },
    });
  }

  return {
    status:              "success",
    message:             "Login successful",
    token:               buildFakeJwt(account),
    role:                account.role,
    orgType:             account.orgType,
    fullName:            account.fullName,
    organisationName:    account.organisationName,
    donorScope:          account.donorScope ?? null,
    mustChangePassword:  account.mustChangePassword,
  };
}



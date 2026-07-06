import { AuthUser } from "@/types/user";
import { MOCK_ORGANISATIONS } from "@/mock/organisation.mock";

/** Fixed OTP for frontend mock registration — always use this on /verify-otp */
export const DUMMY_OTP_CODE = "123456";

export interface SignupOtpMeta {
  email: string;
  code: string;
  sentAt: string;
}

export function buildSignupOtpMeta(email: string): SignupOtpMeta {
  return {
    email: email.trim().toLowerCase(),
    code: DUMMY_OTP_CODE,
    sentAt: new Date().toISOString(),
  };
}

export function isSignupOtpValid(code: string, meta?: Pick<SignupOtpMeta, "code"> | null): boolean {
  return code === DUMMY_OTP_CODE || code === meta?.code;
}

export const MOCK_USERS: Record<string, AuthUser> = {
  // ── Private company users ─────────────────────────────────────────
  CLIENT: {
    id: 1,
    email: "ceo@insightai.rw",
    fullName: "Louise Nzeyimana",
    role: "CLIENT",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    organisations: MOCK_ORGANISATIONS,
    mustChangePassword: false,
  },
  MEMBER: {
    id: 2,
    email: "accountant@insightai.rw",
    fullName: "Eric Bizimana",
    role: "MEMBER",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    mustChangePassword: false,
  },
  AUDITOR: {
    id: 3,
    email: "auditor@audit.rw",
    fullName: "Grace Uwimana",
    role: "AUDITOR",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    mustChangePassword: false,
  },
  ADMIN: {
    id: 4,
    email: "admin@auditinsight.com",
    fullName: "Super Admin",
    role: "ADMIN",
    mustChangePassword: false,
  },
  // ── NGO users ─────────────────────────────────────────────────────
  NGO_ADMIN: {
    id: 10,
    email: "director@rwandahealth.org",
    fullName: "Dr. Emmanuel Nkusi",
    role: "CLIENT",
    organisationId: "org-ngo-001",
    organisationName: "Rwanda Health Foundation",
    mustChangePassword: false,
  },
  NGO_ACCOUNTANT: {
    id: 11,
    email: "finance@rwandahealth.org",
    fullName: "Diane Uwase",
    role: "MEMBER",
    organisationId: "org-ngo-001",
    organisationName: "Rwanda Health Foundation",
    mustChangePassword: false,
  },
  NGO_AUDITOR: {
    id: 12,
    email: "auditor@rwandahealth.org",
    fullName: "Grace Uwimana",
    role: "AUDITOR",
    organisationId: "org-ngo-001",
    organisationName: "Rwanda Health Foundation",
    mustChangePassword: false,
  },
  NGO_DONOR: {
    id: 13,
    email: "s.mitchell@usaid.gov",
    fullName: "Sarah Mitchell",
    role: "MEMBER",
    organisationId: "org-ngo-001",
    organisationName: "Rwanda Health Foundation",
    mustChangePassword: false,
  },
};

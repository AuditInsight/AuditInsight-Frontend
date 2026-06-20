import { AuthUser } from "@/types/user";

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
  CLIENT: {
    id: 1,
    email: "ceo@insightai.rw",
    fullName: "Louise Nzeyimana",
    role: "CLIENT",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
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
};

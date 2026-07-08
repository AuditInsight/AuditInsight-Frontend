import { Organisation, OrganisationMemberResponse } from "@/utils/api";
import { OwnedOrganisation } from "@/types/user";

export const MOCK_ORGANISATIONS: OwnedOrganisation[] = [
  { id: "org-001", name: "InsightAI Rwanda Ltd",        industry: "Financial Technology"          },
  { id: "org-002", name: "Kigali Trade Co.",             industry: "Retail & Commerce"             },
  { id: "org-ngo-001", name: "Rwanda Health Foundation", industry: "NGO / Non-Governmental Organisation" },
];

// Keep single export for hooks that still reference it
export const MOCK_ORGANISATION: Organisation = {
  id: "org-001",
  clientId: "1",
  name: "InsightAI Rwanda Ltd",
  industry: "Financial Technology",
  fiscalYearStart: "01-01",
  fiscalYearEnd: "12-31",
  defaultCurrency: "RWF",
  createdAt: "2024-01-15T08:00:00",
};

export const MOCK_NGO_ORGANISATION: Organisation = {
  id: "org-ngo-001",
  clientId: "5",
  name: "Rwanda Health Foundation",
  industry: "NGO / Non-Governmental Organisation",
  fiscalYearStart: "01-01",
  fiscalYearEnd: "12-31",
  defaultCurrency: "USD",
  createdAt: "2024-03-01T08:00:00",
};

export const MOCK_MEMBERS: OrganisationMemberResponse[] = [
  {
    userId: 1,
    firstName: "Louise",
    lastName: "Nzeyimana",
    emailAddress: "ceo@insightai.rw",
    role: "CLIENT",
    status: "ACTIVE",
    joinedAt: "2024-01-15T08:00:00",
  },
  {
    userId: 2,
    firstName: "Eric",
    lastName: "Bizimana",
    emailAddress: "accountant@insightai.rw",
    role: "MEMBER",
    status: "ACTIVE",
    joinedAt: "2024-02-01T08:00:00",
  },
  {
    userId: 3,
    firstName: "Grace",
    lastName: "Uwimana",
    emailAddress: "auditor@audit.rw",
    role: "AUDITOR",
    status: "ACTIVE",
    joinedAt: "2024-03-10T08:00:00",
  },
  {
    userId: 5,
    firstName: "Patrick",
    lastName: "Mugisha",
    emailAddress: "patrick@insightai.rw",
    role: "MEMBER",
    status: "PENDING",
    joinedAt: "2024-06-01T08:00:00",
  },
];



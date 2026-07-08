export interface MockTenant {
  id: string;
  name: string;
  industry: string;
  ownerEmail: string;
  createdAt: string;
  billingStatus: "PAID" | "UNPAID";
  isBlocked: boolean;
}

export interface MockPendingAuditor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  certificationNumber: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export const MOCK_TENANTS: MockTenant[] = [
  {
    id: "org-001",
    name: "InsightAI Rwanda Ltd",
    industry: "Financial Technology",
    ownerEmail: "ceo@insightai.rw",
    createdAt: "2024-01-15",
    billingStatus: "PAID",
    isBlocked: false,
  },
  {
    id: "org-002",
    name: "Kigali Trade Co.",
    industry: "Retail & Commerce",
    ownerEmail: "owner@kigalitrade.rw",
    createdAt: "2024-02-20",
    billingStatus: "UNPAID",
    isBlocked: false,
  },
  {
    id: "org-003",
    name: "East Africa Logistics",
    industry: "Logistics & Transport",
    ownerEmail: "cfo@ealogistics.rw",
    createdAt: "2024-03-05",
    billingStatus: "PAID",
    isBlocked: false,
  },
  {
    id: "org-004",
    name: "Rwanda Health Partners",
    industry: "Healthcare",
    ownerEmail: "admin@rhp.rw",
    createdAt: "2024-04-10",
    billingStatus: "UNPAID",
    isBlocked: true,
  },
];

export const MOCK_PENDING_AUDITORS: MockPendingAuditor[] = [
  {
    id: 10,
    firstName: "Jean",
    lastName: "Habimana",
    email: "jean.habimana@audit.rw",
    certificationNumber: "CPA-RW-2021-4421",
    submittedAt: "2024-06-12T09:00:00",
    status: "PENDING",
  },
  {
    id: 11,
    firstName: "Diane",
    lastName: "Mukandoli",
    email: "diane.m@auditpro.rw",
    certificationNumber: "ACCA-2019-RW-8873",
    submittedAt: "2024-06-13T14:30:00",
    status: "PENDING",
  },
  {
    id: 12,
    firstName: "Samuel",
    lastName: "Nkusi",
    email: "s.nkusi@cfirm.rw",
    certificationNumber: "CIA-2022-3301",
    submittedAt: "2024-06-14T11:00:00",
    status: "PENDING",
  },
];



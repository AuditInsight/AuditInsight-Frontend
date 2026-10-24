export interface MockPendingAuditor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  certificationNumber: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

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



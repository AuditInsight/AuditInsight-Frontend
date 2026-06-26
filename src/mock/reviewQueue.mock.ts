import { ReviewItem } from "@/lib/reviewEngine";

export interface ReviewMessage {
  id: string;
  author: string;
  role: "AUDITOR" | "MEMBER" | "CLIENT";
  message: string;
  attachmentName?: string;
  timestamp: string;
}

export interface EnrichedReviewItem extends ReviewItem {
  slaHours: number;
  createdAt: string;
  messages: ReviewMessage[];
  rejectedCount: number;
}

export const MOCK_REVIEW_QUEUE: EnrichedReviewItem[] = [
  {
    id: "rq-001",
    type: "Missing Evidence",
    transactionId: "TXN-0002",
    counterparty: "XYZ Corp",
    amount: "RWF 850,000",
    risk: "Critical", severity: "Critical",
    due: "2024-06-05", status: "Open",
    slaHours: 48,
    createdAt: "2024-06-03T10:00:00",
    rejectedCount: 0,
    messages: [
      { id: "m1", author: "Grace Uwimana", role: "AUDITOR", message: "No invoice or bank confirmation attached for this client payment. Please upload supporting documents.", timestamp: "2024-06-03T10:05:00" },
    ],
  },
  {
    id: "rq-002",
    type: "Missing Evidence",
    transactionId: "TXN-0006",
    counterparty: "Global Partners",
    amount: "RWF 2,000,000",
    risk: "Critical", severity: "Critical",
    due: "2024-06-12", status: "Open",
    slaHours: 48,
    createdAt: "2024-06-10T08:00:00",
    rejectedCount: 0,
    messages: [
      { id: "m2", author: "Grace Uwimana", role: "AUDITOR", message: "Consulting revenue of RWF 2M with no contract or invoice attached. Please provide the signed contract and invoice.", timestamp: "2024-06-10T09:00:00" },
    ],
  },
  {
    id: "rq-003",
    type: "Verification Problems",
    transactionId: "TXN-0003",
    counterparty: "Payroll",
    amount: "RWF 1,200,000",
    risk: "Medium", severity: "Medium",
    due: "2024-06-07", status: "In Review",
    slaHours: 72,
    createdAt: "2024-06-05T09:00:00",
    rejectedCount: 1,
    messages: [
      { id: "m3", author: "Grace Uwimana", role: "AUDITOR", message: "Payroll register uploaded but missing HR sign-off signature. Rejected — please re-upload with signature.", timestamp: "2024-06-05T10:00:00" },
      { id: "m4", author: "Eric Bizimana", role: "MEMBER", message: "Apologies — re-uploading signed register now.", attachmentName: "June_Payroll_Signed.pdf", timestamp: "2024-06-06T08:30:00" },
      { id: "m5", author: "Grace Uwimana", role: "AUDITOR", message: "Received. Reviewing the signature against HR records.", timestamp: "2024-06-06T09:00:00" },
    ],
  },
  {
    id: "rq-004",
    type: "Duplicate Transaction",
    transactionId: "TXN-0012",
    counterparty: "Unknown",
    amount: "RWF 980,000",
    risk: "Critical", severity: "Critical",
    due: "2024-06-18", status: "Escalated",
    slaHours: 24,
    createdAt: "2024-06-17T23:55:00",
    rejectedCount: 0,
    messages: [
      { id: "m6", author: "Grace Uwimana", role: "AUDITOR", message: "Possible duplicate of TXN-0016 — same amount and counterparty. Please confirm whether this is a duplicate entry.", timestamp: "2024-06-17T23:56:00" },
      { id: "m7", author: "Grace Uwimana", role: "AUDITOR", message: "Escalated — requires immediate explanation.", timestamp: "2024-06-18T08:00:00" },
    ],
  },
  {
    id: "rq-005",
    type: "Missing Evidence",
    transactionId: "TXN-0005",
    counterparty: "Local Shop",
    amount: "RWF 5,000",
    risk: "Critical", severity: "Critical",
    due: "2024-06-10", status: "Open",
    slaHours: 48,
    createdAt: "2024-06-08T11:00:00",
    rejectedCount: 0,
    messages: [
      { id: "m8", author: "Grace Uwimana", role: "AUDITOR", message: "Weekend cash purchase with no receipt attached. Please upload supporting evidence.", timestamp: "2024-06-08T11:05:00" },
    ],
  },
  {
    id: "rq-006",
    type: "Missing Evidence",
    transactionId: "TXN-0008",
    counterparty: "Royal Catering Co",
    amount: "RWF 750,000",
    risk: "Medium", severity: "Medium",
    due: "2024-06-15", status: "Open",
    slaHours: 72,
    createdAt: "2024-06-13T14:30:00",
    rejectedCount: 0,
    messages: [
      { id: "m9", author: "Grace Uwimana", role: "AUDITOR", message: "Vendor payment with no invoice or receipt attached. Please upload evidence.", timestamp: "2024-06-13T15:00:00" },
    ],
  },
];

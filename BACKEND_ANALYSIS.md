# Backend Analysis & NGO API Integration

## ✅ Backend Structure Found

### Controllers
- `TransactionController` → `/api/transactions`
- `ReviewQueueController` → `/api/review-queue`
- Other controllers: Auth, Evidence, Organisation, etc.

### Key DTOs

#### TransactionResponse (from backend)
```
{
  id: String,
  organisationId: UUID,
  name: String,
  date: LocalDate,
  counterparty: String,
  donor: String (optional),
  budgetLine: String (optional),
  amount: BigDecimal,
  type: INCOME | EXPENSE,
  paymentMethod: BANK | MOBILE_MONEY | CASH,
  status: PENDING | COMPLETED,
  evidenceStatus: MISSING | PARTIAL | COMPLETE,
  createdBy: String,
  createdAt: LocalDateTime,
  evidence: List (only on GET /:id)
}
```

#### ReviewQueueResponse (Audit Flags)
```
{
  id: UUID,
  organisationId: UUID,
  transactionId: String,
  issueType: string,
  description: string,
  status: OPEN | RESOLVED | ESCALATED,
  flaggedBy: string,
  resolvedBy: number,
  resolutionNote: string,
  createdAt: LocalDateTime,
  resolvedAt: LocalDateTime
}
```

## Backend Endpoints
- GET /api/transactions?organisationId={id}
- POST /api/transactions
- PATCH /api/transactions/{id}
- GET /api/review-queue?organisationId={id}
- POST /api/review-queue
- PATCH /api/review-queue/{id}/resolve
- GET /api/evidence?organisationId={id}
- POST /api/evidence

## Status: 40% Integrated → Target 100%

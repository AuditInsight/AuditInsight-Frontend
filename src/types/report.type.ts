export interface AuditReadinessReport {
  readinessScore: number;

  totalTransactions: number;

  totalEvidence: number;

  linkedEvidencePercent: number;

  evidenceBreakdown: {
    complete: number;
    pending: number;
    missing: number;
  };

  outstandingIssues: {
    verificationProblems: number;
    complianceIssues: number;
    fraudFlags: number;
  };

  highRiskTransactions: number;

  overdueReviews: number;

  riskDistribution: {
    label: string;
    value: number;
  }[];
}



import { OrgType } from "./auth";

// Matches backend CreateOrganisationRequest DTO exactly.
// industry = OrganisationType enum (PRIVATE | NGO) — this IS the org type.
// No separate orgType field exists in the backend.
export interface CreateOrganisationRequest {
  name: string;
  industry: OrgType;            // "PRIVATE" | "NGO" — maps to OrganisationType enum
  fiscalYearStart: string;      // MM-dd format e.g. "01-01"
  fiscalYearEnd: string;        // MM-dd format e.g. "12-31"
  currencies: string[];         // e.g. ["USD", "RWF"]
  size: string;                 // required by backend e.g. "1-10", "11-50"
}

export interface OrganisationApiResponse {
  id: string;
  name: string;
  industry: OrgType;            // PRIVATE | NGO
  orgType: OrgType;             // alias — some response shapes include this
  fiscalYearStart: string;
  fiscalYearEnd: string;
  currencies: string[];
  size: string;
  createdAt: string;
}



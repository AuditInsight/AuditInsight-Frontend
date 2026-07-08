import { OrgType } from "./auth";

export interface CreateOrganisationRequest {
  name: string;
  industry: string;
  orgType: OrgType;             // "NGO" | "PRIVATE"
  fiscalYearStart: string;      // MM-dd format e.g. "01-01"
  fiscalYearEnd: string;        // MM-dd format e.g. "12-31"
  currencies: string[];         // e.g. ["USD", "RWF"]
}

export interface OrganisationApiResponse {
  id: string;
  name: string;
  industry: string;
  orgType: OrgType;             // returned by backend after creation / fetch
  fiscalYearStart: string;
  fiscalYearEnd: string;
  currencies: string[];
  createdAt: string;
}



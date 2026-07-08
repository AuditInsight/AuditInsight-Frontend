export type UserRole = "CLIENT" | "AUDITOR" | "ADMIN" | "MEMBER";

export interface OwnedOrganisation {
  id: string;
  name: string;
  industry?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  organisationId?: string;
  organisationName?: string;
  organisations?: OwnedOrganisation[];   // CLIENT: all orgs they own
  mustChangePassword?: boolean;
}

export interface Profile {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone?: string;
  certificationNumber?: string;
  address?: string;
}



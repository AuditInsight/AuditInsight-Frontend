export function normalizeOrganisationId(orgId?: string): string | undefined {
  if (typeof orgId !== "string") {
    console.log("DEBUG normalizeOrganisationId: orgId is not string", typeof orgId, orgId);
    return undefined;
  }
  const trimmed = orgId.trim();
  if (!trimmed) {
    console.log("DEBUG normalizeOrganisationId: orgId is empty after trim");
    return undefined;
  }
  const lower = trimmed.toLowerCase();
  if (lower === "undefined" || lower === "null") {
    console.log("DEBUG normalizeOrganisationId: orgId is literal 'undefined' or 'null'", trimmed);
    return undefined;
  }
  console.log("DEBUG normalizeOrganisationId: returning", trimmed);
  return trimmed;
}

export function isValidOrganisationId(orgId?: string): orgId is string {
  return Boolean(normalizeOrganisationId(orgId));
}

export function normalizeOrganisationId(orgId?: string): string | undefined {
  if (typeof orgId !== "string") return undefined;
  const trimmed = orgId.trim();
  if (!trimmed) return undefined;
  const lower = trimmed.toLowerCase();
  if (lower === "undefined" || lower === "null") return undefined;
  return trimmed;
}

export function isValidOrganisationId(orgId?: string): orgId is string {
  return Boolean(normalizeOrganisationId(orgId));
}

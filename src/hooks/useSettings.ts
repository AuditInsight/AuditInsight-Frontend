"use client";

import { useState, useEffect, useCallback } from "react";
import { OrganisationMemberResponse, getOrganisationMembers, inviteMember as apiInviteMember, removeMember as apiRemoveMember } from "@/utils/api";
import { useOrganisation } from "./useOrganisation";
import { useAuth } from "@/context/AuthContext.production";

export function useSettings() {
  const { user } = useAuth();
  const { org, loading: orgLoading } = useOrganisation();
  const [members,        setMembers]        = useState<OrganisationMemberResponse[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [error,          setError]          = useState<string | null>(null);

  const orgId = user?.organisationId;

  const loadMembers = useCallback(async () => {
    if (!orgId) return;
    setMembersLoading(true);
    try {
      const { data } = await getOrganisationMembers(orgId);
      setMembers(data ?? []);
    } catch (err) {
      console.error("useSettings loadMembers error", err);
      setError("Failed to load members.");
    } finally {
      setMembersLoading(false);
    }
  }, [orgId]);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  const inviteMember = async (email: string, role: string) => {
    if (!orgId) return;
    await apiInviteMember(orgId, email, role);
    await loadMembers();
  };

  const removeMember = async (userId: number) => {
    if (!orgId) return;
    await apiRemoveMember(orgId, userId);
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
  };

  return { org, orgLoading, members, membersLoading, error, inviteMember, removeMember };
}

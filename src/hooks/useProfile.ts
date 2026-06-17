"use client";

import { useEffect, useState } from "react";
import { getClientProfile, getAuditorProfile } from "@/utils/api";

interface Profile {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone?: string;
  certificationNumber?: string;
  address?: string;
}

interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  fullName: string;
  initials: string;
  role: string;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    if (!role) {
      setLoading(false);
      return;
    }

    const fetcher = role === "AUDITOR" ? getAuditorProfile : getClientProfile;

    fetcher()
      .then(({ data }) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fullName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
    : "";

  const initials = profile
    ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const role =
    typeof window !== "undefined" ? (localStorage.getItem("role") ?? "") : "";

  return { profile, loading, fullName, initials, role };
}

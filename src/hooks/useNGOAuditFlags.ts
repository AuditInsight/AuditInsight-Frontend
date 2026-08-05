"use client";

import { useState, useEffect, useCallback } from "react";
import { NGOFlag, FlagSeverity, NGOFlagCategory } from "@/types/ngo";
import { useAuth } from "@/context/AuthContext.production";
import { normalizeOrganisationId } from "@/utils/organisationId";
import { apiClient } from "@/api/client";
import { AxiosError } from "axios";

interface ReviewQueueItem {
  id: string;
  organisationId: string;
  transactionId: string;
  issueType: string;
  description: string;
  status: "OPEN" | "RESOLVED" | "ESCALATED";
  flaggedBy: string;
  resolvedBy?: number;
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

interface CreateFlagRequest {
  organisationId: string;
  transactionId: string;
  issueType: string;
  description: string;
}

interface ResolveFlagRequest {
  status: "RESOLVED" | "DISMISSED";
  resolutionNote?: string;
}

function mapToNGOFlag(item: ReviewQueueItem): NGOFlag {
  return {
    id:        item.id,
    transactionId: item.transactionId,
    projectName: "", // Not available from API response
    category:   item.issueType as NGOFlagCategory,
    severity:   item.status === "ESCALATED" ? "CRITICAL" : "HIGH",
    notes:      item.description,
    flaggedBy:  item.flaggedBy,
    flaggedAt:  item.createdAt,
    resolvedAt: item.resolvedAt,
    status:     item.status as "OPEN" | "RESOLVED" | "DISMISSED",
  };
}

export function useNGOAuditFlags() {
  const { user } = useAuth();
  const [flags, setFlags] = useState<NGOFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const orgId = normalizeOrganisationId(user?.organisationId);
    if (!orgId) {
      setFlags([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<ReviewQueueItem[]>("/review-queue", {
        params: { organisationId: orgId },
      });
      const items = res.data ?? [];
      setFlags(items.map(mapToNGOFlag));
    } catch (err) {
      console.error("useNGOAuditFlags load error", err);
      setError("Failed to load audit flags.");
    } finally {
      setLoading(false);
    }
  }, [user?.organisationId]);

  useEffect(() => {
    const orgId = normalizeOrganisationId(user?.organisationId);
    if (!orgId) {
      queueMicrotask(() => {
        setFlags([]);
        setError(null);
        setLoading(false);
      });
      return;
    }
    load();
  }, [user?.organisationId, load]);

  const flagIssue = async (payload: {
    transactionId: string;
    category: NGOFlagCategory;
    severity: FlagSeverity;
    notes: string;
  }) => {
    const orgId = normalizeOrganisationId(user?.organisationId);
    if (!orgId) {
      throw new Error("Organisation is not selected.");
    }

    const req: CreateFlagRequest = {
      organisationId: orgId,
      transactionId:  payload.transactionId,
      issueType:      payload.category,
      description:    payload.notes || payload.category,
    };

    try {
      const res = await apiClient.post<ReviewQueueItem>("/review-queue", req);
      const newFlag = mapToNGOFlag(res.data);
      setFlags((prev) => [newFlag, ...prev]);
      return newFlag;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      throw new Error(
        axiosErr.response?.data?.message || "Failed to flag issue."
      );
    }
  };

  const resolveFlag = async (
    flagId: string,
    resolution: ResolveFlagRequest
  ) => {
    try {
      const res = await apiClient.patch<ReviewQueueItem>(
        `/review-queue/${flagId}/resolve`,
        resolution
      );
      const resolved = mapToNGOFlag(res.data);
      setFlags((prev) =>
        prev.map((f) => (f.id === flagId ? resolved : f))
      );
      return resolved;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      throw new Error(
        axiosErr.response?.data?.message || "Failed to resolve flag."
      );
    }
  };

  return {
    flags,
    loading,
    error,
    flagIssue,
    resolveFlag,
    refresh: load,
  };
}

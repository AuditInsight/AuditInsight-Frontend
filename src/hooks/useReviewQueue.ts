"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewItem } from "@/lib/reviewEngine";
import {
  getReviewQueue,
  flagIssue as apiFlagIssue,
  resolveIssue as apiResolveIssue,
  IssueType,
} from "@/utils/api";
import { useAuth } from "@/context/AuthContext.production";

function mapToReviewItem(r: {
  id: string;
  transactionId: string;
  issueType: string;
  description: string;
  status: string;
  flaggedBy: string;
  createdAt: string;
}): ReviewItem {
  return {
    id:            r.id,
    transactionId: r.transactionId,
    type:          r.issueType,
    description:   r.description,
    status:        r.status === "RESOLVED" ? "Resolved" : r.status === "ESCALATED" ? "Escalated" : "Open",
    flaggedBy:     r.flaggedBy,
    createdAt:     r.createdAt,
    risk:          "Medium",
    amount:        "",
    due:           r.createdAt,
  };
}

export function useReviewQueue() {
  const { user } = useAuth();
  const [items,   setItems]   = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const orgId = user?.organisationId ?? "";

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const { data } = await getReviewQueue(orgId);
      setItems((data ?? []).map(mapToReviewItem));
    } catch (err) {
      console.error("useReviewQueue load error", err);
      setError("Failed to load review queue.");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { load(); }, [load]);

  const flagIssue = async (item: Omit<ReviewItem, "id">) => {
    await apiFlagIssue({
      organisationId: orgId,
      transactionId:  String(item.transactionId),
      issueType:      item.type as IssueType,
      description:    item.description ?? item.type,
    });
    await load();
  };

  const resolveIssue = async (id: string, note: string) => {
    await apiResolveIssue(id, note);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Resolved" } : i))
    );
  };

  return { items, loading, error, flagIssue, resolveIssue, refresh: load };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { getPlans } from "@/utils/api";
import { PRICING_PLANS, PricingPlan } from "@/types/billing";
import { isAxiosError } from "axios";

interface UsePlansReturn {
  plans: PricingPlan[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Live plan catalog merged onto the static PRICING_PLANS marketing copy
 * (name/description/features/cta stay static — only price/durationDays are
 * admin-editable). Falls back to PRICING_PLANS untouched while loading, on
 * error, or when the caller isn't authenticated (GET /plans requires a
 * token), so consumers never see an empty array.
 */
export function usePlans(): UsePlansReturn {
  const [plans, setPlans] = useState<PricingPlan[]>(PRICING_PLANS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPlans();
      const merged = PRICING_PLANS.map((plan) => {
        const live = data.find((p) => p.code === plan.id);
        return live ? { ...plan, price: live.amount, durationDays: live.durationDays } : plan;
      });
      setPlans(merged);
    } catch (err) {
      setPlans(PRICING_PLANS);
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to load plan prices.");
      } else {
        setError("Failed to load plan prices.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
}

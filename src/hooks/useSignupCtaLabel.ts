"use client";

import { useEffect, useState } from "react";
import { getTrialOffer } from "@/utils/api";

/**
 * Sign-up button wording. AuditInsight is paid by default, so it only says "Start Free Trial" while a Super Admin
 * trial campaign is actually granting trials to new organisations.
 */
export function useSignupCtaLabel(): string {
  const [trialActive, setTrialActive] = useState(false);

  useEffect(() => {
    let current = true;
    getTrialOffer()
      .then(({ data }) => {
        if (current) setTrialActive(data.active);
      })
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, []);

  return trialActive ? "Start Free Trial" : "Get Started";
}

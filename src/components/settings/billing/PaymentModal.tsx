"use client";

// PaymentModal is now a thin wrapper around CheckoutModal.
// This keeps the existing API surface (open, plan, cycle, onClose, onSuccess)
// while delegating all UI to the new Stripe-like CheckoutModal.

import CheckoutModal from "@/components/payment/CheckoutModal";
import { PlanTier, BillingCycle } from "@/types/billing";

interface Props {
  open: boolean;
  plan: PlanTier;
  cycle: BillingCycle;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ open, plan, cycle, onClose, onSuccess }: Props) {
  return (
    <CheckoutModal
      open={open}
      plan={plan}
      cycle={cycle}
      onClose={onClose}
      onSuccess={() => onSuccess()}
    />
  );
}

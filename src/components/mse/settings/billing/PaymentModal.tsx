"use client";

// PaymentModal is now a thin wrapper around CheckoutModal.
// This keeps the existing API surface (open, plan, onClose, onSuccess)
// while delegating all UI to the new Stripe-like CheckoutModal.

import CheckoutModal from "@/components/payment/CheckoutModal";
import { SubscriptionType } from "@/types/billing";

interface Props {
  open: boolean;
  plan: SubscriptionType;
  organisationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ open, plan, organisationId, onClose, onSuccess }: Props) {
  return (
    <CheckoutModal
      open={open}
      plan={plan}
      organisationId={organisationId}
      onClose={onClose}
      onSuccess={() => onSuccess()}
    />
  );
}


